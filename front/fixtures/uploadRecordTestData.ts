export interface Record {
    title: string;
    artist: string;
    year: number | null;
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
            coverURL: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'title',
        expectedError: 'Title is required'
    },
    {
        testName: 'Record Upload Error - No Artist',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: '',
            year: 1959,
            genre: 'Jazz',
            coverURL: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'artist',
        expectedError: 'Artist is required'
    },
    {
        testName: 'Record Upload Error - No Year',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: null,
            genre: 'Jazz',
            coverURL: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'year',
        expectedError: 'Year is required'
    },
    {
        testName: 'Record Upload Error - Year before 1900',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: 1899,
            genre: 'Jazz',
            coverURL: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'year',
        expectedError: 'Year must be 1900 or later'
    },
    {
        testName: 'Record Upload Error - Year in the future',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: new Date().getFullYear() + 1,
            genre: 'Jazz',
            coverURL: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'year',
        expectedError: `Year cannot be later than ${new Date().getFullYear()}`
    },
    {
        testName: 'Record Upload Error - No Genre',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: 1959,
            genre: '',
            coverURL: 'https://lh3.googleusercontent.com/p1RfwuXvm7JCcN17exJvvug2uTVmll4PE23zp2KSqrny800hWDmIYX_J6ZuOQS2m3Fvh6_7MRRcARcYt=w544-h544-l90-rj'
        },
        field: 'genre',
        expectedError: 'Genre is required'
    },
    {
        testName: 'Record Upload Error - No Cover URL',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: 1959,
            genre: 'Jazz',
            coverURL: ''
        },
        field: 'cover',
        expectedError: 'Cover must be a valid URL'
    },
    {
        testName: 'Record Upload Error - No valid Cover URL',
        data: {
            title: 'Plays The Jerome Kern Song Book',
            artist: 'Oscar Peterson',
            year: 1959,
            genre: 'Jazz',
            coverURL: 'not-a-valid-url'
        },
        field: 'cover',
        expectedError: 'Cover must be a valid URL'
    }
]
