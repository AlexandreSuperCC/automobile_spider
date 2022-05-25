SELECT
	s.id,
	s.NAME,
	count(*) 
FROM
	t_piece_detaillee pd
	INNER JOIN t_piece p ON pd.pid = p.id
	INNER JOIN t_systeme s ON s.id = p.sid 
WHERE
	pd.vdef1 != '' 
GROUP BY
	s.id,
	s.NAME;


UPDATE t_piece_detaillee SET vdef1= REPLACE(vdef1,'"','') where vdef1 != '';

where sid in (select * from t_systeme)