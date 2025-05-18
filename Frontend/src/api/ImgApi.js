import axios from 'axios';

// ✅ S3 preSigned URL 요청 (profile, ai_profile 등 type 인자)
export const getPreSignedUrl = async (type, userType) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await axios.get('/api/aws/s3/user/preSigned', {
            params: { type, userType },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('PreSigned URL Response:', response.data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || '이미지 업로드 URL 발급 실패';
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};



// ✅ 리뷰용 preSigned URL 요청
export const getReviewPreSignedUrls = async (count) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
        const response = await axios.get('/api/aws/s3/review/preSigned', {
            params: { count },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });


        return response.data;  // [{ preSignedUrl, key }, ...]
    } catch (error) {
        const errorMessage = error.response?.data?.message || '리뷰 이미지 업로드 URL 발급 실패';
        throw {
            status: error.response?.status || 0,
            message: errorMessage
        };
    }
};


