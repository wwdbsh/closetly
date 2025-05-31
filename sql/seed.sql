INSERT INTO place_categories (place_category_id, name) VALUES
(0, '직장'), (1, '학교'), (2, '가정'), (3, '연애'), (4, '자아(본인)'), (5, '대인관계'), (6, '기타')
ON CONFLICT (name) DO NOTHING;

INSERT INTO situation_categories (situation_category_id, name) VALUES
(0, '우울감/무기력'), (1, '불안/초조'), (2, '스트레스 관리'), (3, '분노 조절 어려움'), (4, '강박적 생각/행동'),
(5, '섭식 문제'), (6, '수면 문제'), (7, '중독 문제 (알코올, 게임 등)'), (8, '트라우마/PTSD'), (9, '애도/상실감'),
(10, '자존감 문제'), (11, '성격 문제'), (12, '진로/학업 문제'), (13, '관계 문제 (가족, 친구, 연인)'), (14, '기타')
ON CONFLICT (name) DO NOTHING;

INSERT INTO symptom_categories (symptom_category_id, name) VALUES
(0, '슬픔/비애감'), (1, '흥미 저하'), (2, '죄책감/무가치함'), (3, '집중력 저하'), (4, '피로감/활력 저하'),
(5, '식욕 변화 (증가 또는 감소)'), (6, '수면 변화 (불면 또는 과다수면)'), (7, '정신운동 지체/초조'), (8, '죽음/자살에 대한 반복적 생각'),
(9, '과도한 걱정'), (10, '안절부절못함'), (11, '근육 긴장'), (12, '쉽게 놀람'), (13, '공황 발작'), (14, '특정 공포증'), (15, '기타')
ON CONFLICT (name) DO NOTHING;

DO $$
DECLARE
    -- 이 UUID는 외부 authUser 시스템의 ID와 동일하다고 가정합니다.
    v_user_id_1 UUID := gen_random_uuid();
BEGIN
    -- 1. users 테이블에 상담사 정보 삽입
    INSERT INTO users (user_id, role, email, nickname, avatar_background_color, created_at, updated_at)
    VALUES (v_user_id_1, 'counselor', 'counselor.kim@example.com', '따뜻한상담사김쌤', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    -- 2. counselors 테이블에 상세 정보 삽입
    INSERT INTO counselors (counselor_user_id, real_name, profile_image_url, total_counseling_count, years_of_experience, is_verified, short_introduction, center_name, center_address, average_rating, review_count, introduction_greeting)
    VALUES (v_user_id_1, '홍길동', '/ai-humans/human1.png', 150, 5, TRUE, '항상 따뜻한 마음으로 다가가는 상담사, 홍길동입니다.', '심리상담센터 논현점', '서울시 강남구 테헤란로 123, 4층', 4.85, 45, '안녕하세요, 마음의 안식처를 찾고 계신가요? 제가 함께 하겠습니다.');

    -- 3. counselor_available_methods 정보 삽입
    INSERT INTO counselor_available_methods (counselor_id, method, price_per_hour, is_active)
    VALUES
        (v_user_id_1, 'chat', 30000, TRUE),
        (v_user_id_1, 'phone', 40000, TRUE),
        (v_user_id_1, 'video', 50000, TRUE);

    -- 4. counselor_introduction_items 정보 삽입 (선택적)
    INSERT INTO counselor_introduction_items (counselor_id, title, description, display_order)
    VALUES
        (v_user_id_1, '전문 분야', '우울증, 불안장애, 대인관계 스트레스 전문 상담', 0),
        (v_user_id_1, '상담 철학', '공감과 지지를 바탕으로 내담자 중심의 상담을 진행합니다.', 1);

    -- 5. counselor_articles 정보 삽입 (선택적)
    INSERT INTO counselor_articles (counselor_id, title, institution, published_date, article_url)
    VALUES
        (v_user_id_1, '코로나 블루 극복하기', '마음건강 매거진', '2024-05-10', 'https://example.com/articles/covid_blue_overcome'),
        (v_user_id_1, '건강한 관계 맺기', '도닥도닥 칼럼', '2024-08-22', 'https://example.com/articles/healthy_relationships');
END $$;


-- 상담사 2
DO $$
DECLARE
    v_user_id_2 UUID := gen_random_uuid();
BEGIN
    INSERT INTO users (user_id, role, email, nickname, avatar_background_color, created_at, updated_at)
    VALUES (v_user_id_2, 'counselor', 'counselor.lee@example.com', '공감상담사이쌤', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    INSERT INTO counselors (counselor_user_id, real_name, profile_image_url, total_counseling_count, years_of_experience, is_verified, short_introduction, center_name, center_address, average_rating, review_count, introduction_greeting)
    VALUES (v_user_id_2, '김서윤', '/ai-humans/human2.png', 220, 8, TRUE, '당신의 이야기를 경청하고 함께 성장하는 김서윤 상담사입니다.', '강남심리상담', '서울시 강남구 테헤란로 123, 4층', 4.92, 68, '마음의 어려움, 혼자 끙끙 앓지 마세요. 제가 당신의 든든한 지원군이 되어 드릴게요.');

    INSERT INTO counselor_available_methods (counselor_id, method, price_per_hour, is_active)
    VALUES
        (v_user_id_2, 'chat', 35000, TRUE),
        (v_user_id_2, 'video', 55000, TRUE);

    INSERT INTO counselor_introduction_items (counselor_id, title, description, display_order)
    VALUES
        (v_user_id_2, '주요 상담 영역', '청소년 상담, 부부/가족 상담, 자존감 향상', 0),
        (v_user_id_2, '상담 스타일', '내담자의 강점을 발견하고 잠재력을 키우는 데 중점을 둡니다.', 1),
        (v_user_id_2, '자격 사항', '임상심리전문가, 청소년상담사 1급', 2);

    INSERT INTO counselor_articles (counselor_id, title, institution, published_date, article_url)
    VALUES
        (v_user_id_2, '십대 자녀와의 대화법', '부모 교육센터 자료실', '2023-11-15', 'https://example.com/articles/teen_communication');
END $$;


-- 상담사 3
DO $$
DECLARE
    v_user_id_3 UUID := gen_random_uuid();
BEGIN
    INSERT INTO users (user_id, role, email, nickname, avatar_background_color, created_at, updated_at)
    VALUES (v_user_id_3, 'counselor', 'counselor.park@example.com', '친절한박원장', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    INSERT INTO counselors (counselor_user_id, real_name, profile_image_url, total_counseling_count, years_of_experience, is_verified, short_introduction, center_name, center_address, average_rating, review_count, introduction_greeting)
    VALUES (v_user_id_3, '이시연', '/ai-humans/human3.png', 80, 3, FALSE, '새내기 상담사 이시연입니다. 진심을 다해 돕겠습니다.', '온라인마음상담', '온라인 전용', 4.50, 15, '안녕하세요! 편안한 분위기에서 여러분의 고민을 나누고 싶습니다.');

    INSERT INTO counselor_available_methods (counselor_id, method, price_per_hour, is_active)
    VALUES
        (v_user_id_3, 'chat', 25000, TRUE),
        (v_user_id_3, 'phone', 35000, TRUE);

    -- 상담사 3은 소개 아이템 및 기사 없음
END $$;

DO $$
DECLARE
    v_user_id_4 UUID := gen_random_uuid();
BEGIN
    INSERT INTO users (user_id, role, email, nickname, avatar_background_color, created_at, updated_at)
    VALUES (v_user_id_4, 'counselor', 'counselor.park@example.com', '친절한박원장', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    INSERT INTO counselors (counselor_user_id, real_name, profile_image_url, total_counseling_count, years_of_experience, is_verified, short_introduction, center_name, center_address, average_rating, review_count, introduction_greeting)
    VALUES (v_user_id_4, '박준호', '/ai-humans/human4.png', 80, 3, FALSE, '내 마음을 나도 모를 때, 제가 도와드릴게요.', '마음치료센터 인계점', '서울시 강남구 테헤란로 123, 4층', 4.50, 15, '안녕하세요! 편안한 분위기에서 여러분의 고민을 나누고 싶습니다.');

    INSERT INTO counselor_available_methods (counselor_id, method, price_per_hour, is_active)
    VALUES
        (v_user_id_4, 'chat', 25000, TRUE),
        (v_user_id_4, 'phone', 35000, TRUE);
END $$;

DO $$
DECLARE
    v_user_id_5 UUID := gen_random_uuid();
BEGIN
    INSERT INTO users (user_id, role, email, nickname, avatar_background_color, created_at, updated_at)
    VALUES (v_user_id_5, 'counselor', 'counselor.park@example.com', '친절한박원장', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    INSERT INTO counselors (counselor_user_id, real_name, profile_image_url, total_counseling_count, years_of_experience, is_verified, short_introduction, center_name, center_address, average_rating, review_count, introduction_greeting)
    VALUES (v_user_id_5, '김영호', '/ai-humans/human5.png', 80, 3, FALSE, '육아 스트레스와 부부관계, 저와 함께 정리해봐요', '심리상담재활센터 중화점', '서울시 강남구 테헤란로 123, 4층', 4.50, 15, '안녕하세요! 편안한 분위기에서 여러분의 고민을 나누고 싶습니다.');

    INSERT INTO counselor_available_methods (counselor_id, method, price_per_hour, is_active)
    VALUES
        (v_user_id_5, 'chat', 35000, TRUE),
        (v_user_id_5, 'phone', 45000, TRUE);
END $$;

DO $$
DECLARE
    v_user_id_6 UUID := gen_random_uuid();
BEGIN
    INSERT INTO users (user_id, role, email, nickname, avatar_background_color, created_at, updated_at)
    VALUES (v_user_id_6, 'counselor', 'counselor.park@example.com', '친절한박원장', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    INSERT INTO counselors (counselor_user_id, real_name, profile_image_url, total_counseling_count, years_of_experience, is_verified, short_introduction, center_name, center_address, average_rating, review_count, introduction_greeting)
    VALUES (v_user_id_6, '임하진', '/ai-humans/human6.png', 80, 3, FALSE, '감정 조절과 분노 관리, 훈련이 아니라 이해로 시작합니다', '마음치료센터 강북점', '서울시 강남구 테헤란로 123, 4층', 4.50, 15, '안녕하세요! 편안한 분위기에서 여러분의 고민을 나누고 싶습니다.');

    INSERT INTO counselor_available_methods (counselor_id, method, price_per_hour, is_active)
    VALUES
        (v_user_id_6, 'chat', 25000, TRUE),
        (v_user_id_6, 'phone', 35000, TRUE),
        (v_user_id_6, 'video', 45000, TRUE);
END $$;