import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDrugs, getNDCs } from '../api';
import './DrugDetails.css';

const DrugDetails = () => {
  const { drug_name } = useParams();
  const [drugInfo, setDrugInfo] = useState(null);
  const [ndcs, setNdcs] = useState([]);

  useEffect(() => {
    const fetchDrugDetails = async () => {
      const drugData = await getDrugs(decodeURIComponent(drug_name));
      if (drugData && drugData.drugGroup?.conceptGroup) {
        const concept = drugData.drugGroup.conceptGroup.flatMap(group => group.conceptProperties || [])
          .find(item => item.name.toLowerCase() === decodeURIComponent(drug_name).toLowerCase());
        
        if (concept) {
          setDrugInfo(concept);
          const ndcData = await getNDCs(concept.rxcui);
          if (ndcData && ndcData.ndcGroup?.ndcList) {
            setNdcs(ndcData.ndcGroup.ndcList.ndc);
          }
        } else {
          setDrugInfo({ name: drug_name, rxcui: 'N/A', synonym: 'N/A' }); 
        }
      }
    };
    fetchDrugDetails();
  }, [drug_name]);

  if (!drugInfo) return <p>Loading...</p>;

  return (
    <div className="details-container">
      <h2>{drugInfo.name}</h2>
      <p><strong>RxCUI:</strong> {drugInfo.rxcui}</p>
      <p><strong>Synonym:</strong> {drugInfo.synonym}</p>
      <h3>Associated NDCs</h3>
      <ul>
        {ndcs.map((ndc) => (
          <li key={ndc}>{ndc}</li>
        ))}
      </ul>
    </div>
  );
};

export default DrugDetails;
