
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDrugs, getSpellingSuggestions } from '../api';
import './DrugSearch.css';

const DrugSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(history);
  }, []);

  const handleSearch = async () => {
    if (query.trim() === '') return; 

    setError('');
    setResults([]);

    try {
      const drugData = await getDrugs(query);
      if (drugData && drugData.drugGroup?.conceptGroup) {
        const concepts = drugData.drugGroup.conceptGroup.flatMap(group => group.conceptProperties || []);
        setResults(concepts);
        
        
        const updatedHistory = [...new Set([query, ...searchHistory])]; 
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      } else {
        const suggestions = await getSpellingSuggestions(query);
        if (suggestions && suggestions.suggestionGroup?.suggestionList?.suggestion) {
          const suggestionNames = suggestions.suggestionGroup.suggestionList.suggestion.join(', ');
          setError(`Did you mean: ${suggestionNames}?`);
        } else {
          setError('No results found.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching data.');
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion);
    setResults([]); 
  };

  return (
    <div className="search-container">
      <h1>Search for Drugs</h1>
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Enter drug name..." 
        onFocus={() => setResults([])} 
      /> 
      <br/><br/>
      <button onClick={handleSearch}>Search</button>
      {error && <p className="error">{error}</p>}
      {query && searchHistory.length > 0 && (
        <ul className="suggestions">
          {searchHistory.filter(name => name.toLowerCase().includes(query.toLowerCase())).map((suggestion, index) => (
            <li key={index} onClick={() => handleSelectSuggestion(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <ul>
        {results.map((result) => (
          <li key={result.rxcui} onClick={() => navigate(`/drugs/${encodeURIComponent(result.name)}`)}>
            {result.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DrugSearch;
