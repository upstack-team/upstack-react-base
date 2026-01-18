import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { Promotion, AnneeAcademique } from '../../types';

interface FiltresClassementProps {
  filters: {
    promotionId: string;
    anneeAcademique: string;
  };
  onFilterChange: (filters: { promotionId: string; anneeAcademique: string }) => void;
  onSearch: () => void;
}

const FiltresClassement: React.FC<FiltresClassementProps> = ({
  filters,
  onFilterChange,
  onSearch,
}) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [anneesAcademiques, setAnneesAcademiques] = useState<AnneeAcademique[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setPromotions([
        { id: '1', nom: 'Promotion 2023-2024', anneeDebut: 2023, anneeFin: 2024 },
        { id: '2', nom: 'Promotion 2024-2025', anneeDebut: 2024, anneeFin: 2025 },
      ]);

      setAnneesAcademiques([
        { 
          id: '2023-2024', 
          libelle: '2023-2024', 
          dateDebut: '2023-09-01', 
          dateFin: '2024-08-31',
        },
        { 
          id: '2024-2025', 
          libelle: '2024-2025', 
          dateDebut: '2024-09-01', 
          dateFin: '2025-08-31',
        },
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handlePromotionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, promotionId: event.target.value });
  };

  const handleAnneeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, anneeAcademique: event.target.value });
  };

  const handleSearchClick = () => {
    onSearch();
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filtres du Classement
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 3,
        alignItems: 'center'
      }}>
        <TextField
          select
          fullWidth
          label="Promotion"
          value={filters.promotionId}
          onChange={handlePromotionChange}
          disabled={loading}
          size="small"
          sx={{ flex: 1 }}
        >
          <MenuItem value="">
            <em>Sélectionner une promotion</em>
          </MenuItem>
          {promotions.map((promotion) => (
            <MenuItem key={promotion.id} value={promotion.id}>
              {promotion.nom}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Année Académique"
          value={filters.anneeAcademique}
          onChange={handleAnneeChange}
          disabled={loading}
          size="small"
          sx={{ flex: 1 }}
        >
          <MenuItem value="">
            <em>Sélectionner une année</em>
          </MenuItem>
          {anneesAcademiques.map((annee) => (
            <MenuItem key={annee.id} value={annee.id}>
              {annee.libelle}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearchClick}
          disabled={loading || !filters.promotionId || !filters.anneeAcademique}
          sx={{ 
            height: '40px',
            minWidth: { xs: '100%', sm: 'auto' }
          }}
        >
          Rechercher
        </Button>
      </Box>
    </Paper>
  );
};

export default FiltresClassement;