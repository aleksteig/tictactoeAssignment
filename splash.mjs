import { ANSI } from "./ansi.mjs";

const ART = `
${ANSI.COLOR.BLUE} ______  ____   __  ${ANSI.RESET}${ANSI.COLOR.GREEN}    ______   ____    __   ${ANSI.RESET}${ANSI.COLOR.RED}   ______   ___     ___    ${ANSI.RESET}
${ANSI.COLOR.BLUE}|      ||    | /  ] ${ANSI.RESET}${ANSI.COLOR.GREEN}   |      | /    |  /  ]  ${ANSI.RESET}${ANSI.COLOR.RED}  |      | /   \\   /  _]  ${ANSI.RESET}
${ANSI.COLOR.BLUE}|      | |  | /  /  ${ANSI.RESET}${ANSI.COLOR.GREEN}   |      ||  o  | /  /   ${ANSI.RESET}${ANSI.COLOR.RED}  |      ||     | /  [_    ${ANSI.RESET}
${ANSI.COLOR.BLUE}|_|  |_| |  |/  /   ${ANSI.RESET}${ANSI.COLOR.GREEN}   |_|  |_||     |/  /    ${ANSI.RESET}${ANSI.COLOR.RED}  |_|  |_||  O  ||    _]   ${ANSI.RESET}
${ANSI.COLOR.BLUE}  |  |   |  /   \\_ ${ANSI.RESET}${ANSI.COLOR.GREEN}      |  |  |  _  /   \\_ ${ANSI.RESET}${ANSI.COLOR.RED}      |  |  |     ||   [_  ${ANSI.RESET}
${ANSI.COLOR.BLUE}  |  |   |  \\     |${ANSI.RESET}${ANSI.COLOR.GREEN}      |  |  |  |  \\     |${ANSI.RESET}${ANSI.COLOR.RED}      |  |  |     ||     | ${ANSI.RESET}
${ANSI.COLOR.BLUE}  |__|  |____\\____|${ANSI.RESET}${ANSI.COLOR.GREEN}      |__|  |__|__|\\____|${ANSI.RESET}${ANSI.COLOR.RED}      |__|   \\___/ |_____|${ANSI.RESET}

`

function showSplashScreen() {
    console.log(ART);
}

export default showSplashScreen;