import sha256 from 'crypto-js/sha256'
import Hex from 'crypto-js/enc-hex'
import * as request from 'request'

export const signSha256 = (str: string) => sha256(str).toString(Hex);
export const firstToLowerCase = (str: string) => str.trim().toLowerCase().replace(str[0], str[0].toUpperCase());
export const firstToUperCase = (str: string) => str.trim().toLowerCase().replace(str[0], str[0].toLocaleUpperCase());

export const truncate = (q: string) => {
    const len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}


/**
 * Description youdao translate
 * @date 3/3/2023 - 3:28:48 PM
 * @param {string} keyword translate keyword
 * @param {('ru' | 'auto' | 'en' | 'zh-CHS')} lang
 * @returns {Promise<string>}
 */
export const translate = (
    keyword: string,
    lang: 'ru' | 'auto' | 'en' | 'zh-CHS'
): Promise<string> => {
    const appKey = process.env.YD_APPKEY;
    const key = process.env.YD_APPSECRET; //注意：暴露appSecret，有被盗用造成损失的风险
    const salt = new Date().getTime();
    const curtime = Math.round(new Date().getTime() / 1000);
    const str = appKey + truncate(keyword) + salt + curtime + key;
    const sign = signSha256(str);
    return new Promise((resolve, reject) => {
        request.post({
            url: 'https://openapi.youdao.com/api',
            form: {
                q: keyword,
                appKey,
                salt,
                from: lang,
                to: 'en',
                sign,
                signType: 'v3',
                curtime: curtime,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            json: true,
        }, (err, res) => {
            if (err) {
                reject(err);
            }
            const data = res.body as unknown as any;
            if (!data.translation) {
                resolve("");
            } else {
                resolve(data.translation[0]);
            }
        });
    });
};

/**
 * Description translate ZhCn to En CamelCase
 * @date 3/3/2023 - 3:30:05 PM
 * @param {string} cn chinese keywords
 * @returns {unknown}
 */
export const xt = async (cn: string) => {
    const translated = await translate(cn, 'zh-CHS')
    return translated.split(" ").reduce((pre, val, index) => {
        let handledStr = '';
        if (index === 0) {
            handledStr = firstToLowerCase(String(val))
        } else {
            handledStr = firstToUperCase(val)
        }
        return pre + handledStr;
    }, "")
}