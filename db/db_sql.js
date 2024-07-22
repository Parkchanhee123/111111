module.exports = {
    cust_select:'SELECT * FROM cust',
    cust_select_one:'SELECT * FROM cust WHERE id = ?',          //아이디가 ?인놈을 조회해라
    cust_insert:'INSERT INTO cust (id,pwd,name, acc) VALUES (?,?,?,?)',     //4개의 값 들어감
    cust_update: 'UPDATE cust SET pwd=?, name=?, acc=? WHERE id=?', // 4개의 값 수정    키값 이전에는 ',' 안들어감
    cust_delete:'DELETE FROM cust WHERE id = ?',     //삭제

    item_select:'SELECT * FROM item',
    item_select_one:'SELECT * FROM item WHERE id = ?',          //아이디가 ?인놈을 조회해라
    //item_insert:'INSERT INTO item (name,price, imgname, regdate) VALUES (?,?,?,?)',     //4개의 값 들어감
    item_insert:'INSERT INTO item VALUES (0, ?,?,?, sysdate())',     //4개의 값 들어감
    // 위의 cust처럼 쓰면 내가 각 컬럼의 값을 임의로 전부 작성해서 넣는것, 
    // 바로 위의 item 처럼 작성하면 내가 ?로 지정한 값만 들어가고
    // 나머지는 sql에서 사전에 작성한 값이 들어가게 됨 (id는 순차증가 regdate는 시스템 시간)
    item_update: 'UPDATE item SET name=?, price=?, imgname=? WHERE id=?', // 4개의 값 수정    키값 이전에는 ',' 안들어감
    item_delete:'DELETE FROM item WHERE id = ?'     //삭제
}   
