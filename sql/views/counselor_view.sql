CREATE OR REPLACE VIEW counselor_view AS
SELECT
  p.profile_id,
  p.name,
  p.avatar_url,
  p.marketing_consent,
  c.total_counseling_count,
  c.years_of_experience,
  c.is_verified,
  c.short_introduction,
  c.center_name,
  c.center_address,
  c.average_rating,
  c.review_count,
  c.introduction_greeting
FROM profiles p
LEFT JOIN counselors c ON p.profile_id = c.counselor_id
WHERE p.role = 'counselor';