const ListItem = ({ title, removeSelf }) => (
    <div className="item">
        <p className="item__title">{title}</p>
        <button className="item__remove" onClick={removeSelf}>X</button>
    </div>
)

export default ListItem