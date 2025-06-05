let frequencia: number | null = null;

export const setFrequencia = (valor: number) => {
  frequencia = valor;
};

export const getFrequencia = (): number | null => {
  return frequencia;
};
