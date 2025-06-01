-- 상담사 1 데이터
DO $$
DECLARE
    -- 이 UUID는 profiles 테이블에 존재하는 profile_id 여야 합니다.
    v_counselor_profile_id_1 UUID := '5f6be9db-c8be-4cda-b945-6f51958bf444'; -- 예시 UUID, 실제 profiles.profile_id 값으로 대체 필요
BEGIN
    INSERT INTO counselors (
        counselor_id,
        total_counseling_count,
        years_of_experience,
        is_verified,
        short_introduction,
        center_name,
        center_address,
        average_rating,
        review_count,
        introduction_greeting
        -- created_at, updated_at 컬럼은 Drizzle ORM의 ...timestamps에 의해 자동 관리될 것으로 예상
    ) VALUES (
        v_counselor_profile_id_1,
        120,  -- 총 상담 횟수
        5,    -- 경력 (년)
        TRUE, -- 인증 여부
        '따뜻한 마음으로 당신의 이야기를 경청하고 함께 성장하는 상담사입니다.', -- 한 줄 소개
        '마음나눔 상담센터', -- 소속 센터 이름
        '서울시 강남구 테헤란로 123, 행복빌딩 5층', -- 소속 센터 주소
        '4.75', -- 평균 평점
        35,   -- 리뷰 수
        '안녕하세요. 마음의 짐을 덜고 싶으신가요? 편안한 대화를 통해 문제 해결의 실마리를 찾아가도록 돕겠습니다.' -- 소개 섹션 인사말
    );
END $$;
