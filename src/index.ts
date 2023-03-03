#!/usr/bin/env node
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { xt } from './helper/xt'
dotenv.config()
const [,, ...argv] = process.argv
if (argv[0]) {
    xt(argv[0]).then((text: string) => {
        console.log(text)
        // return text
    })
} else {
    console.log("No arguments")
}