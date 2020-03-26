import React, { useState ,useEffect } from 'react';
import { Link, useHistory} from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import './styles.css';
import logoSvg  from '../../assets/logo.svg';
import api from '../../services/api';

export default function Profile(){
    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');
    const history = useHistory();
    const [incidents, setIncidents] = useState([]);
    
    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId
            }
        }).then(res => {
            setIncidents(res.data);
        })

    }, [ongId]);
    
    async function handleDeleteIncident(id){
        try{
            await api.delete(`incident/${id}`, { headers: { Authorization: ongId, }});
            setIncidents(incidents.filter(incident => incident.id !== id))
        }catch(err){
            alert('Erro ao deletar caso!')
        }
    }

    function handleLogout(){
        localStorage.clear();
        history.push('/')
    }
    return(
        <div className="profile-container">
            <header>
                <img src={logoSvg} alt="Be the hero Logo"/>
                <span>Bem vinda, {ongName}</span> 

                <Link className="button" to="/incident/new">Cadastrar novo caso</Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#E02941"></FiPower>
                </button>
            </header>

            <h1> Casos Cadastrados</h1>

            <ul>
                {
                    incidents.map(incident => (
                            <li key={incident.id}>
                                <strong>CASO:</strong>
                                <p>{incident.title}</p>
                                <strong>DESCRICAO:</strong>
                                <p>{incident.description}</p>
                                <strong>VALOR:</strong>
                                <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(incident.value)}</p>

                                <button onClick={()=> handleDeleteIncident(incident.id)}type="button">
                                    <FiTrash2 size={20} color="#a8a8b3"/>
                                </button>
                            </li>
                        )
                    )
                }
            </ul>
        </div>
    )
}