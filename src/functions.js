// повертає меню
export async function getPrices(BASE_URL) {
  const res = await fetch(BASE_URL);
  const json = await res.json();
  return json; 
}
