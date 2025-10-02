import countryOptions from "../data/country_phone_codes";

interface CountryData {
    country: string;
    name: string;
}

const getCountry = async (): Promise<CountryData | null> => {
    try {
        const fetchResponse = await fetch("https://get.geojs.io/v1/ip/country.json");
        if (!fetchResponse.ok) {
            throw new Error(`HTTP error! status: ${fetchResponse.status}`);
        }
        const countryData: CountryData = await fetchResponse.json();
        console.log(countryData);
        return countryData;
    } catch (error: unknown) {
        console.error("Error fetching country:", error);
        return null;
    }
};

const defaultSelector = async () => {
    try {
        const userCountry = await getCountry();
        if (!userCountry) {
            console.log("Could not determine user's country");
            return null;
        }

        console.log(`Searching for country code: ${userCountry.country}`);

        for (let i = 0; i < countryOptions.length; i++) {
            const label = countryOptions[i].label;
            // Search for the country code in the label (case-insensitive)
            if (label.toLowerCase().includes(userCountry.country.toLowerCase())) {
                console.log(`Found matching country: ${label}`);
                return countryOptions[i];
            }
        }

        console.log(`No matching country found for: ${userCountry.country}`);
        return null;
    } catch (error) {
        console.error("Error in defaultSelector:", error);
        return null;
    }
};

export { getCountry, defaultSelector };