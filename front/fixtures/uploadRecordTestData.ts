export interface Record {
    title: string;
    artist: string;
    year: number | null;
    genre: string;
    cover: string;
    description: string;
}

export const validRecord: Record[] = [
    {
        title: 'Plays The Jerome Kern Song Book',
        artist: 'Oscar Peterson',
        year: 1959,
        genre: 'Jazz',
        cover: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj',
        description: 'Valid Record for Successful Upload'
    }
]

export interface RecordUploadErrorCases {
    testName: string;
    data: Partial<Record>;
    field: 'title' | 'artist' | 'year' | 'genre' | 'cover';
    expectedError: string;
}

export const recordUploadErrorCases: RecordUploadErrorCases[] = [
    {
        testName: 'Record Upload Error - No Title',
        data: {
            title: '',
            artist: 'Oscar Peterson',
            year: 1959,
            genre: 'Jazz',
            cover: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'title',
        expectedError: 'Title cannot be empty'
    },
    {
        testName: 'Record Upload Error - No Artist',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: '',
            year: 1959,
            genre: 'Jazz',
            cover: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'artist',
        expectedError: 'Artist cannot be empty'
    },
    {
        testName: 'Record Upload Error - No Year',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: null,
            genre: 'Jazz',
            cover: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'year',
        expectedError: 'Year cannot be null'
    },
    {
        testName: 'Record Upload Error - Year before 1600',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: 1599,
            genre: 'Jazz',
            cover: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'year',
        expectedError: 'Year must be greater than or equal to 1600'
    },
    {
        testName: 'Record Upload Error - Year in the future',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: new Date().getFullYear() + 1,
            genre: 'Jazz',
            cover: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'year',
        expectedError: `Year cannot be in the future`
    },
    {
        testName: 'Record Upload Error - No Genre',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: 1959,
            genre: '',
            cover: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'genre',
        expectedError: 'Genre cannot be empty'
    },
    {
        testName: 'Record Upload Error - No Cover URL',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: 1959,
            genre: 'Jazz',
            cover: ''
        },
        field: 'cover',
        expectedError: 'Cover cannot be empty'
    },
    {
        testName: 'Record Upload Error - No valid Cover URL',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: 1959,
            genre: 'Jazz',
            cover: 'not-a-valid-url'
        },
        field: 'cover',
        expectedError: 'Cover must be a valid URL'
    }
]
