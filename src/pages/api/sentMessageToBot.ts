import {NextApiRequest, NextApiResponse} from "next";


export default async function handlerSentFormToBot(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const {children, city, divorce, location, maino, name, tel} = req.body;

        const chatId = '-1002451060564'
        const botToken = '7899154192:AAEhnksDL2X2RNuSI9GDKjMcQjc0v8yvFno'
        const sendMessageUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
        const message = `
        *Нова заявка на сайті:*
        Імя: ${name}
        Номер: ${tel}
        Розлучення: ${divorce}
        Діти: ${children}
        Місце знаходження: ${location}
        Місто: ${city}
        Майно:${maino}`

        // Send message to Telegram bot
        try {
            const response = await fetch(sendMessageUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'MarkdownV2',
                }),
            })
            if (response.ok) {
                res.status(200).json({success: true, message: 'Повідомлення надіслано!'});
            } else {
                const errorData = await response.json();
                res.status(500).json({success: false, error: errorData});
            }
        } catch (err) {
             const  error = err as Error;
            res.status(500).json({success: false, message:  error.message})
        }
    }else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Метод ${req.method} не дозволений`);
    }
}