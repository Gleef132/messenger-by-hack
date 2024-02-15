export const createAvatarGradient = (): {colorTop: string, colorBottom: string} => {
    // Генерируем случайный цвет
    const color = generateRandomColor();

    // Создаем светлый и темный оттенки этого цвета
    const lighterColor = lighten(color, 20); // Увеличиваем яркость на 20%
    const darkerColor = darken(color, 20); // Уменьшаем яркость на 20%

    return {colorTop: lighterColor, colorBottom: darkerColor};
}

// Функция для генерации случайного цвета
function generateRandomColor(): string {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        const random = Math.random() * 16 | 0;
        color += (i === 0 ? random & 0x7 : random).toString(16);
    }
    return color;
}

// Функции для изменения яркости цвета
function lighten(color: string, percent: number): string {
    return adjustBrightness(color, percent);
}

function darken(color: string, percent: number): string {
    return adjustBrightness(color, -percent);
}

function adjustBrightness(color: string, percent: number): string {
    const num = parseInt(color.replace("#",""),16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          B = ((num >> 8) & 0x00FF) + amt,
          G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}