CREATE FUNCTION refresh_token_cleanup()
RETURNS TRIGGER AS $$
BEGIN	
	DELETE FROM refresh_tokens
	WHERE expires_at < NOW();
	
	DELETE FROM refresh_tokens
	WHERE user_id = NEW.user_id
		AND token_id <> NEW.token_id;
		
	RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER refresh_token_cleanup_t
AFTER INSERT ON refresh_tokens
FOR EACH ROW
EXECUTE FUNCTION refresh_token_cleanup();

