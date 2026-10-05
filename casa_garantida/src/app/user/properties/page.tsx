import React from 'react'
import PropertiesTable from './_components/PropertiesTable';
import { getPropriedade } from '@/services/propriedadeService'; // Ajuste o caminho do seu service

const PropertiesPage = async () => {
  // Busca as propriedades diretamente da sua API C# + SQL Server
  const properties = await getPropriedade();

  return (
    <PropertiesTable properties={properties} />
  )
}

export default PropertiesPage