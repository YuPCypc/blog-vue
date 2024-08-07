export interface UserRespVO {
    id: string;            // 对应 Java 类中的 Long 类型
    nickname: string;      // 对应 Java 类中的 String 类型
    email: string;         // 对应 Java 类中的 String 类型
    phone: string;         // 对应 Java 类中的 String 类型
    bio: string;           // 对应 Java 类中的 String 类型
    avatarUri: string;     // 对应 Java 类中的 String 类型
}

export interface ArticleRespDTO {
    id: string;
    title: string;
    summary: string;
    authorId: string;
    userRespVO: UserRespVO;
    likeCount: number;
    viewCount: number;
    favoriteCount: number;
}

export interface ArticleDetailRespDTO{
    id: string;
    title: string;
    summary: string;
    content: string;
    categoryId: number;
    userRespVO: UserRespVO;
    likeCount: number;
    viewCount: number;
    favoriteCount: number;
    updateTime: string;
}