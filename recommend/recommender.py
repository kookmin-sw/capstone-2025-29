from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List
from preprocessor import TextPreprocessor

class VolunteerRecommender:
    def __init__(self):
        self.preprocessor = TextPreprocessor()
        self.vectorizer = TfidfVectorizer()
    
    def get_recommendations(self, elderly_details: str, volunteer_bios: List[str], top_n: int = 4) -> List[int]:
        """
        노인의 요청사항과 봉사자들의 자기소개를 기반으로 추천 인덱스를 반환합니다.
        
        Args:
            elderly_details (str): 노인의 요청사항
            volunteer_bios (List[str]): 봉사자들의 자기소개 목록
            top_n (int): 추천할 봉사자 수 (기본값: 4)
            
        Returns:
            List[int]: 추천된 봉사자들의 인덱스 리스트
        """
        # 전처리
        processed_elderly = self.preprocessor.preprocess(elderly_details)
        processed_volunteers = [self.preprocessor.preprocess(bio) for bio in volunteer_bios]
        
        # 모든 텍스트를 하나의 리스트로 결합
        all_texts = [processed_elderly] + processed_volunteers
        
        # TF-IDF 벡터화
        tfidf_matrix = self.vectorizer.fit_transform(all_texts)
        
        # 코사인 유사도 계산
        cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]
        
        # 상위 N개 인덱스 반환
        top_indices = np.argsort(cosine_similarities)[::-1][:top_n]
        
        return top_indices.tolist() 