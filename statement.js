function statement(invoice) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Счет для ${invoice.customer}\n`;
    const billFormat = new Intl.NumberFormat("ru-RU",
        {
            style: "currency", currency: "RUB",
            minimumFractionDigits: 2
        }
    );

    for (let play of invoice.performances) {
        let thisAmount = getPerformanceAmount(play.type, play.audience);
        volumeCredits += getVolumeCredits(play.type, play.audience);
        totalAmount += thisAmount;
        
        result += getAccountLine(play.playId, play.audience, thisAmount, billFormat);
    }

    result = getTotalAccount(totalAmount, volumeCredits, billFormat);

    return result;
}

let getPerformanceAmount = (type, audience) => {
    let thisAmount = 0;
    switch (type) {
        case "tragedy":
            thisAmount = 40000;
            if (audience > 30) {
                thisAmount += 1000 * (audience - 30);
            }
            return thisAmount;
        case "comedy":
            thisAmount = 30000 + 300 * audience;
            if (audience > 20) {
                thisAmount += 10000 + 500 * (audience - 20);
            }
            return thisAmount;
        default:
            throw new Error(`Неизвестный тип: ${type}`);
    }
}

let getVolumeCredits = (type, audience) => {
    // Добавление бонусов
    let volumeCredits = Math.max(audience - 30, 0);

    // Дополнительный бонус за каждые 10 комедий
    if (type === "comedy") {
        volumeCredits += Math.floor(audience/10);
    }

    return volumeCredits;
}

let getAccountLine = (playId, audience, thisAmount, billFormat) => {
    return `${playId}: ${billFormat.format(thisAmount / 100)} (${audience} мест)\n`;
}


let getTotalAccount = (totalAmount, volumeCredits, billFormat) => {
    return `Итого с вас ${billFormat.format(totalAmount / 100)}\n Вы заработали ${volumeCredits} бонусов\n`;
}
