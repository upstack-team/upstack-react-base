 
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import ClassementTable from '../components/Classement/ClassementTable';
import FiltresClassement from '../components/Classement/FiltresClassement';
import ExportCSVButton from '../components/Classement/ExportCSVButton';
import EmptyState from '../components/Classement/EmptyState';
// import { useAuth } from '../hooks/useAuth'; a décommenter lors de l'intégration de l'authentification
import { fetchClassementPromotion } from '../services/classementService';
import type { ClassementItem } from '../types';

const ClassementPage: React.FC = () => {
  const [classementData, setClassementData] = useState<ClassementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    promotionId: '',
    anneeAcademique: '',
  });

  const isDirecteurEtudes = true; // Remplacez par useAuth().isDirecteurEtudes pour l'authentification réelle

  // Protection d'accès
  useEffect(() => {
    if (!isDirecteurEtudes) {
      setError('Accès non autorisé. Seul le Directeur des Études peut consulter ce classement.');
    }
  }, [isDirecteurEtudes]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleSearch = async () => {
    if (!filters.promotionId || !filters.anneeAcademique) {
      setError('Veuillez sélectionner une promotion et une année académique');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchClassementPromotion(
        filters.promotionId,
        filters.anneeAcademique
      );
      setClassementData(data);
    } catch (err) {
      setError('Erreur lors de la récupération du classement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isDirecteurEtudes) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Classement Général de la Promotion
          </Typography>
          {classementData.length > 0 && <ExportCSVButton data={classementData} />}
        </Box>

        <FiltresClassement
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : classementData.length === 0 ? (
          <EmptyState />
        ) : (
          <ClassementTable data={classementData} />
        )}
      </Paper>
    </Container>
  );
};

export default ClassementPage;