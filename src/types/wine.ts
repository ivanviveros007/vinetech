export interface Wine {
  id?: string;
  name: string;
  type?: 'red' | 'white' | 'rosé' | 'sparkling';
  year?: number;
  region: string;
  description?: string;
  price?: number;
  rating?: number;
  variety?: string;
  imageUri: string;
  hervestYear?: number;
  notes?: string;
}
