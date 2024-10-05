import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../slices/storeSlice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const params = useParams<{ id: string }>();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === params.id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
