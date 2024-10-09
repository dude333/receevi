function getHour12Option(locale: string): boolean {
    // Define locales that typically use 12-hour format
    const hour12Locales = ["en-US", "en-AU", "en-CA", "en-NZ", "ko-KR"];
    return hour12Locales.includes(locale);
}

export function formatDateTime(date: Date, locale: string): string {
    const now = new Date();
    const diffInMs = now - date;
    const oneDay = 24 * 60 * 60 * 1000;

    const translations: { [key: string]: string } = {
        "en-US": "Yesterday",
        "pt-BR": "Ontem",
    };

    const hour12 = getHour12Option(locale);

    // Recent messages (within the last 24 hours)
    if (diffInMs < oneDay) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12 });
    }

    // Yesterday
    if (diffInMs < 2 * oneDay && date.getDate() === now.getDate() - 1) {
        return translations[locale] || translations["en-US"];
    }

    // Day of the week
    if (diffInMs < 7 * oneDay) {
        return date.toLocaleDateString(locale, { weekday: "long" });
    }

    // More than a week old
    return date.toLocaleDateString(locale); // Format as dd/mm/yyyy
}

export function formatTime(time: Date, locale: string): string {
    return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: getHour12Option(locale),
    });
}
