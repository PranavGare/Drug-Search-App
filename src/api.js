import axios from 'axios';

export const getDrugs = async (name) => {
  try {
    const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching drugs:", error);
    return null;
  }
};

export const getSpellingSuggestions = async (name) => {
  try {
    const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${name}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching spelling suggestions:", error);
    return null;
  }
};

export const getNDCs = async (rxcui) => {
  try {
    const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/ndcs.json`);
    return response.data;
  } catch (error) {
    console.error("Error fetching NDCs:", error);
    return null;
  }
};
