export class AreaDto {
  id: string;
  title: string;
  description?: string;
  type = 'Polygon';
  coordinates: number[][][];
}
