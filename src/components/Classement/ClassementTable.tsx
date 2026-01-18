import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import type { ClassementItem } from '../../types/index';

interface ClassementTableProps {
  data: ClassementItem[];
}

const ClassementTable: React.FC<ClassementTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rang</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nom</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prénom</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">
              Total Points
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
              Évaluations
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">
              Moyenne
            </TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
              Performance
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.etudiantId} hover>
              <TableCell>
                <Chip
                  label={`${item.rang}${item.rang <= 3 ? '🏆' : ''}`}
                  color={
                    item.rang === 1
                      ? 'primary'
                      : item.rang === 2
                      ? 'secondary'
                      : item.rang === 3
                      ? 'success'
                      : 'default'
                  }
                  variant={item.rang <= 3 ? 'filled' : 'outlined'}
                />
              </TableCell>
              <TableCell>{item.nom}</TableCell>
              <TableCell>{item.prenom}</TableCell>
              <TableCell align="right">{item.totalPoints.toFixed(2)}</TableCell>
              <TableCell align="center">{item.nombreEvaluations}</TableCell>
              <TableCell align="right">
                <Chip
                  label={`${item.moyenne.toFixed(2)}/20`}
                  color={
                    item.moyenne >= 16
                      ? 'success'
                      : item.moyenne >= 12
                      ? 'info'
                      : item.moyenne >= 10
                      ? 'warning'
                      : 'error'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                {item.moyenne >= 16
                  ? 'Excellent'
                  : item.moyenne >= 12
                  ? 'Bon'
                  : item.moyenne >= 10
                  ? 'Satisfaisant'
                  : 'À améliorer'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClassementTable;