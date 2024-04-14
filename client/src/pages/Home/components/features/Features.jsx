import React from 'react'
import { AiFillAppstore } from "react-icons/ai";
import { FaMobile, FaGlobe } from "react-icons/fa";
import { SiProgress, SiAntdesign } from "react-icons/si";
import Title from '../layouts/Title';
import Card from './Card';

const Features = () => {
  return (
    <section
      id="features"
      className="w-full py-20 border-b-[1px] border-b-black"
    >
      <Title title="Contexte" des="Problème avec les solutions actuelles" style={{color:'gray'}} />
     
        <ul style={{color:'black'}}>
            <li><strong>Preuve d'âge centralisée:</strong> Les solutions actuelles, comme les cartes d'identité et les permis de conduire, sont centralisées et contrôlées par des gouvernements ou des institutions privées.</li>
            <li><strong>Risques de sécurité et de confidentialité:</strong> Cela pose des risques de sécurité et de confidentialité, car ces institutions peuvent stocker et partager vos informations personnelles sans votre consentement.</li>
            <li><strong>Manque de transparence et d'auditabilité:</strong> Il est souvent difficile de vérifier l'authenticité de ces documents, ce qui peut faciliter la fraude et le vol d'identité.</li>
        </ul>

        <Title title="" des="Avantages de la technologie ZKP et de la blockchain" color="gray"/>
     
       
        <ul style={{color:'black'}}>
            <li><strong>Preuve d'âge décentralisée et sécurisée:</strong> ZKP et la blockchain permettent de prouver votre âge sans révéler d'informations sensibles.</li>
            <li><strong>Confidentialité et contrôle accru:</strong> Vous conservez le contrôle de vos données et pouvez choisir de les partager uniquement avec les parties de confiance.</li>
            <li><strong>Transparence et auditabilité:</strong> Les transactions sur la blockchain sont transparentes et peuvent être vérifiées par quiconque.</li>
        </ul>

        <Title title="" des="Cas d'utilisation prévus" />
     
       
        <ul style={{color:'black'}}>
            <li><strong>Vérification de l'âge en ligne:</strong> ZKP et la blockchain peuvent être utilisés pour vérifier l'âge des utilisateurs pour les sites Web et les applications qui exigent une restriction d'âge, comme les jeux d'argent en ligne et les sites de vente de tabac et d'alcool.</li>
            <li><strong>Vote en ligne:</strong> La technologie ZKP peut permettre aux citoyens de voter en ligne de manière sécurisée et anonyme, tout en s'assurant que seuls les éligibles peuvent voter.</li>
            <li><strong>Embauche et inscription à l'école:</strong>  Les employeurs et les établissements d'enseignement peuvent utiliser ZKP pour vérifier l'âge des candidats et des étudiants sans avoir à collecter et stocker des informations sensibles.</li>
        </ul>


     
    </section>
  );
}

export default Features