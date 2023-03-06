export function logger(type: "GREEN" | "RED" | "YELLOW", message: string) {
    const date = new Date();
    const time = date.toLocaleTimeString();
    const colors = {
        GREEN: "\u001b[42m",
        RED: "\u001b[41m",
        YELLOW: "\u001b[43m"
    }
    console.log(` ${colors[type]}${time} | ● ${formatString(message)}  \u001b[0m`);
}

export function formatString(string: string) {
    if (string.length >= 38) return string;
    const spaces = 38 - string.length;
    return string + " ".repeat(spaces);
}