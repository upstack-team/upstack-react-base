import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import exportToCSV from '../../utils/exportCSV';
import type { ClassementItem } from '../../types';

interface ExportCSVButtonProps {
  data: ClassementItem[];
}

const ExportCSVButton: React.FC<ExportCSVButtonProps> = ({ data }) => {
  const handleExport = () => {
    const csvData = data.map((item) => ({
      Rang: item.rang,
      Nom: item.nom,
      Prénom: item.prenom,
      'Total Points': item.totalPoints,
      'Nombre d\'évaluations': item.nombreEvaluations,
      Moyenne: item.moyenne,
      Promotion: item.promotionId,
      'Année académique': item.anneeAcademique,
    }));

    exportToCSV(csvData, `classement_promotion_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <Button
      variant="contained"
      startIcon={<DownloadIcon />}
      onClick={handleExport}
      disabled={data.length === 0}
      color="secondary"
    >
      Exporter en CSV
    </Button>
  );
};

export default ExportCSVButton;