-- 상담사 1 데이터
DO $$
DECLARE
    -- 이 UUID는 profiles 테이블에 존재하는 profile_id 여야 합니다.
    -- <<주의>> 아래 UUID를 실제 profiles.profile_id 값으로 변경해주세요!
    v_counselor_profile_id_1 UUID := '067e6162-3b6f-4ae2-a171-2470b63dff00'; -- 예시: 실제 값으로 변경
BEGIN
    -- 먼저 profiles 테이블에 v_counselor_profile_id_1 값이 존재하는지 확인하거나, 없다면 삽입해야 합니다.
    -- 예시: INSERT INTO profiles (profile_id, ...) VALUES (v_counselor_profile_id_1, ...); (profiles 스키마에 맞게)

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
    )
    ON CONFLICT (counselor_id) DO NOTHING; -- 이미 해당 counselor_id가 존재하면 무시 (선택적)
END $$;

-- 사용할 counselor_id 정의 (모든 INSERT 쿼리에서 이 ID를 사용)
DO $$
DECLARE
    v_counselor_id UUID := '13c8bb1e-f7d4-4823-8185-a36b951f27ed';
    -- counseling_methodEnum에 정의된 값이라고 가정합니다.
    -- 실제 ENUM 값으로 대체해야 할 수 있습니다.
    -- 예시: CREATE TYPE "counseling_method" AS ENUM ('chat', 'phone', 'video', 'visit');
    enum_chat TEXT := 'chat';
    enum_phone TEXT := 'phone';
    enum_video TEXT := 'video';
    enum_visit TEXT := 'visit';
BEGIN

    -- ================================================
    -- counselor_available_methods 데이터 삽입
    -- ================================================
    -- 가정: 'chat', 'phone', 'video'는 counseling_methodEnum에 유효한 값입니다.

    INSERT INTO counselor_available_methods (
        counselor_id,
        method,
        price_per_hour,
        is_active
        -- created_at, updated_at는 자동 관리 가정
    ) VALUES
    (v_counselor_id, enum_chat::"counseling_method", 25000, TRUE), -- 실제 ENUM 타입명 "counseling_method"로 캐스팅
    (v_counselor_id, enum_phone::"counseling_method", 35000, TRUE),
    (v_counselor_id, enum_video::"counseling_method", 45000, FALSE); -- 비디오 상담은 현재 비활성

    RAISE NOTICE 'Inserted data into counselor_available_methods for counselor_id: %', v_counselor_id;

    -- ================================================
    -- counselor_introduction_items 데이터 삽입
    -- ================================================
    -- item_id는 SERIAL이므로 자동 증가합니다.

    INSERT INTO counselor_introduction_items (
        counselor_id,
        title,
        description,
        display_order
        -- created_at, updated_at는 자동 관리 가정
    ) VALUES
    (v_counselor_id, '전문 상담 분야', '우울, 불안, 대인관계 문제 전문. 다년간의 임상 경험을 바탕으로 개인 맞춤형 상담을 제공합니다.', 0),
    (v_counselor_id, '상담 철학 및 접근법', '내담자 중심 접근을 기반으로 하며, 인지행동치료(CBT)와 수용전념치료(ACT) 기법을 통합적으로 활용합니다. 안전하고 지지적인 환경에서 내면의 힘을 찾도록 돕습니다.', 1),
    (v_counselor_id, '주요 자격 및 학력', '임상심리전문가 (보건복지부 공인), OOO대학교 심리학 석사 졸업. 지속적인 학술 연구와 수련을 통해 전문성을 유지하고 있습니다.', 2);

    RAISE NOTICE 'Inserted data into counselor_introduction_items for counselor_id: %', v_counselor_id;

    -- ================================================
    -- counselor_articles 데이터 삽입
    -- ================================================
    -- article_id는 SERIAL이므로 자동 증가합니다.

    INSERT INTO counselor_articles (
        counselor_id,
        title,
        institution,
        published_date,
        article_url
        -- created_at, updated_at는 자동 관리 가정
    ) VALUES
    (v_counselor_id, '현대인의 스트레스 관리법: 마음챙김을 중심으로', '대한심리학회 뉴스레터', '2024-03-15 00:00:00+09', 'https://example.com/articles/stress-management-mindfulness'),
    (v_counselor_id, '코로나19 이후의 정신 건강: 회복탄력성 키우기', '정신건강의학신문', '2023-11-01 00:00:00+09', 'https://example.com/articles/post-covid-mental-health'),
    (v_counselor_id, '자존감 향상을 위한 5가지 실천적 방법', '도닥도닥 자체 블로그', NOW() - INTERVAL '2 months', 'https://dodok.example.com/blog/self-esteem-tips'); -- 2달 전 발행된 것으로 설정

    RAISE NOTICE 'Inserted data into counselor_articles for counselor_id: %', v_counselor_id;

END $$;

SELECT 'Dummy data insertion process completed for counselor_id: 13c8bb1e-f7d4-4823-8185-a36b951f27ed' AS status;