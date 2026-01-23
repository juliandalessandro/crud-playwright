export interface Record {
    title: string;
    artist: string;
    year: number;
    genre: string;
    coverURL: string;
    description: string;
}

export const validRecord: Record[] = [
    {
        title: 'Plays The Jerome Kern Song Book',
        artist: 'Oscar Peterson',
        year: 1959,
        genre: 'Jazz',
        coverURL: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj',
        description: 'Valid Record for Successful Upload'
    }
]