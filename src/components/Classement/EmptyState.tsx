// src/components/Classement/EmptyState.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button
} from '@mui/material';
import {
  ErrorOutline,
  Refresh,
  School
} from '@mui/icons-material';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onRefresh?: () => void;
  showAction?: boolean;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Aucune donnée disponible',
  message = 'Aucun classement n\'est disponible pour le moment',
  onRefresh,
  showAction = true,
  icon = <ErrorOutline sx={{ fontSize: 60, color: 'text.secondary' }} />
}) => {
  return (
    <Paper 
      sx={{ 
        p: 6, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        bgcolor: 'background.default'
      }}
      elevation={0}
    >
      <Box sx={{ mb: 3 }}>
        {icon}
      </Box>
      
      <Typography variant="h5" gutterBottom fontWeight="medium">
        {title}
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
          maxWidth: 400,
          mb: 4 
        }}
      >
        {message}
      </Typography>

      {showAction && onRefresh && (
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
          sx={{ mt: 2 }}
        >
          Actualiser
        </Button>
      )}
    </Paper>
  );
};

// Variantes prédéfinies
export const NoDataEmptyState: React.FC<{ onRefresh?: () => void }> = ({ onRefresh }) => (
  <EmptyState
    title="Aucun classement disponible"
    message="Aucune évaluation n'a été effectuée pour cette promotion. Le classement s'affichera une fois que des notes seront disponibles."
    icon={<School sx={{ fontSize: 60, color: 'action.disabled' }} />}
    onRefresh={onRefresh}
  />
);

export const ErrorEmptyState: React.FC<{ 
  onRetry?: () => void;
  errorMessage?: string;
}> = ({ onRetry, errorMessage }) => (
  <EmptyState
    title="Erreur de chargement"
    message={errorMessage || 'Une erreur est survenue lors du chargement du classement.'}
    icon={<ErrorOutline sx={{ fontSize: 60, color: 'error.main' }} />}
    onRefresh={onRetry}
    showAction={!!onRetry}
  />
);

export const NoResultsEmptyState: React.FC<{ 
  searchQuery?: string;
  onClear?: () => void;
}> = ({ searchQuery, onClear }) => (
  <EmptyState
    title="Aucun résultat trouvé"
    message={
      searchQuery 
        ? `Aucun étudiant ne correspond à "${searchQuery}"`
        : 'Aucun étudiant ne correspond aux critères de recherche'
    }
    icon={<ErrorOutline sx={{ fontSize: 60, color: 'warning.main' }} />}
    onRefresh={onClear}
    showAction={!!onClear}
  />
);

export const NoPromotionSelectedEmptyState: React.FC = () => (
  <EmptyState
    title="Sélectionnez une promotion"
    message="Veuillez sélectionner une promotion dans le menu déroulant pour afficher son classement."
    icon={<School sx={{ fontSize: 60, color: 'info.main' }} />}
    showAction={false}
  />
);

export default EmptyState;