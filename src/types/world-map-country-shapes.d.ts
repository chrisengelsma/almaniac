declare module 'world-map-country-shapes' {
  export interface CountryShape {
    id: string;
    shape: string;
  }

  const countries: CountryShape[];
  export default countries;
}
