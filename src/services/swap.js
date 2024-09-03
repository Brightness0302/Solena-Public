export async function fetchCoins() {
    try {
        const response = await fetch('https://tokens.jup.ag/tokens?tags=verified');

        if (!response.ok) {
            throw new Error(`Error fetching coins: ${response.statusText}`);
        }

        const coins = await response.json();
        return coins;
    } catch (error) {
        console.error('Failed to fetch coins:', error);
        return null;
    }
}
