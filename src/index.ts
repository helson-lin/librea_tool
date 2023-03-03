#!/usr/bin/env node
import { xt } from './helper/xt'
const [,, ...argv] = process.argv
if (argv[0]) {
    xt(argv[0]).then((text: string) => {
        console.log(text)
        // return text
    })
} else {
    console.log("No arguments")
}