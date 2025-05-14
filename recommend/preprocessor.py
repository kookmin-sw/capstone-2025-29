import re
from kiwipiepy import Kiwi
from typing import List

class TextPreprocessor:
    def __init__(self):
        self.kiwi = Kiwi()
        self.stop_words = {'이', '그', '저', '것', '수', '등', '및', '또', '더', '많이', '적게', '잘', '못', '좋다', '나쁘다'}
    
    def remove_special_chars(self, text: str) -> str:
        """한글 특수문자 제거"""
        return re.sub(r'[^\w\s가-힣]', ' ', text)
    
    def correct_spelling(self, text: str) -> str:
        """맞춤법 교정"""
        try:
            result = self.kiwi.analyze(text)
            corrected = ''
            for token, pos, _ in result[0][0]:
                if pos.startswith('V') or pos.startswith('A'):  # 동사나 형용사인 경우
                    corrected += token + ' '
                else:
                    corrected += token
            return corrected.strip()
        except:
            return text
    
    def tokenize(self, text: str) -> List[str]:
        """형태소 분석 및 토큰화"""
        return [
            token.form for token in self.kiwi.tokenize(text)
            if token.form not in self.stop_words
        ]
    
    def preprocess(self, text: str) -> str:
        """전체 전처리 과정 수행"""
        text = self.remove_special_chars(text)
        text = self.correct_spelling(text)
        tokens = self.tokenize(text)
        return ' '.join(tokens)