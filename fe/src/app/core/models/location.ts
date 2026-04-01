export enum AttractionTier {
	MustSee = 1,
	WorthVisiting = 2,
	HiddenGem = 3,
}

export interface Location {
	id: string;
	createdAt: string;
	lastUpdatedAt: string;
	isArchived: boolean;
	parentLocationId: string | null;
	name: string;
	description: string;
	notes: string;
	attractionTier: AttractionTier;
	latitude: number;
	longitude: number;
}

export interface CreateLocationRequest {
	parentLocationId: string | null;
	name: string;
	description: string;
	notes: string;
	attractionTier: AttractionTier;
	latitude: number;
	longitude: number;
}

export interface UpdateLocationRequest extends CreateLocationRequest {}


// Locations are listed in a hierarchy --> tree 
// if i want to map that i need to make a recursive data structure
export interface LocationNode extends Location {
	children: LocationNode[];
}
