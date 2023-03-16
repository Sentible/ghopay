export interface LensPicture {
  original: {
    __typename: string;
    url: string;
    mimeType?: any;
  }
}

export interface LensStats {
  __typename: string;
  commentsCount: number;
  mirrorsCount: number;
  postsCount: number;
  totalCollects: number;
  totalComments: number;
  totalFollowers: number;
  totalFollowing: number;
  totalMirrors: number;
  totalPosts: number;
  totalPublications: number;
}

export interface ProfileAttribute {
  __typename: string;
  displayType?: any;
  key: string;
  value: string;
}

export interface LensProfile {
  __attributes: ProfileAttribute[];
  __isFollowedByMe: boolean;
  __typename: 'Profile';
  bio: string;
  coverPicture: LensPicture;
  handle: string;
  id: string;
  isFollowingObserver: boolean;
  name: string;
  onChainIdentity: {
    ens: {
      name: string;
    }
  };
  ownedBy: string;
  picture: LensPicture;
  stats: LensStats;
}
