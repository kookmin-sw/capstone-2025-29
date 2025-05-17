import grpc
from concurrent import futures
import user_recommendation_pb2
import user_recommendation_pb2_grpc
from recommender import VolunteerRecommender
from db import SessionLocal
from volunteer_model import Volunteer

class UserRecommendationServicer(user_recommendation_pb2_grpc.UserRecommendationServiceServicer):
    def __init__(self):
        self.recommender = VolunteerRecommender()

    def GetRecommendedUsers(self, request, context):
        try:
            user_ids = list(request.userIds) if request.userIds else []

            if not user_ids:
                print("userIds가 비어 있습니다. 빈 추천 결과를 반환합니다.")
                return user_recommendation_pb2.RecommendationResponse(
                    recommendedUserIds=[]
                )

            print("Received user IDs:", user_ids)

            # DB에서 volunteer 정보 조회
            session = SessionLocal()
            volunteers = session.query(Volunteer).filter(Volunteer.id.in_(user_ids)).all()
            session.close()

            # 봉사자 자기소개 리스트 추출
            volunteer_bios = [v.bio or "" for v in volunteers]
            # id 순서 맞추기
            id_map = {v.id: v for v in volunteers}
            sorted_volunteers = [id_map[uid] for uid in user_ids if uid in id_map]
            volunteer_bios = [v.bio or "" for v in sorted_volunteers]

            # 예시 elderly_details (실제 서비스에서는 파라미터로 받을 수 있음)
            elderly_details = request.elderlyDetail

            recommended_indices = self.recommender.get_recommendations(
                elderly_details=elderly_details,
                volunteer_bios=volunteer_bios
            )

            print("Recommended indices:", recommended_indices)
            recommended_user_ids = [user_ids[idx] for idx in recommended_indices]

            return user_recommendation_pb2.RecommendationResponse(
                recommendedUserIds=recommended_user_ids
            )
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return user_recommendation_pb2.RecommendationResponse()

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_recommendation_pb2_grpc.add_UserRecommendationServiceServicer_to_server(
        UserRecommendationServicer(), server
    )
    server.add_insecure_port('[::]:50051')
    server.start()
    print("gRPC 서버가 50051 포트에서 실행 중입니다...")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()