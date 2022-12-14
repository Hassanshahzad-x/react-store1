import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import MenuContext from './MenuContext'
import MenuCard from './MenuCard'

const MenuBody = React.memo(
  ({ CardComponent, wrapProps, card, cards, rootHeader, rootFooter, children }) => {
    const { classes, drawerWidth } = useContext(MenuContext)
    const position = -drawerWidth * card

    return (
      <>
        {children}
        <div
          className={classes.bodyWrap}
          style={{ transform: `translateX(${position}px)` }}
          {...wrapProps}
        >
          {cards.map((item, depth) => (
            <CardComponent
              card={card}
              key={depth}
              item={item}
              depth={depth}
              rootHeader={rootHeader}
              rootFooter={rootFooter}
            />
          ))}
        </div>
      </>
    )
  },
)

MenuBody.propTypes = {
  /**
   * Additional props for the wrap element
   */
  wrapProps: PropTypes.object,

  /**
   * Overrides the default component used to display menu cards
   */
  CardComponent: PropTypes.elementType.isRequired,
  card: PropTypes.number,
  cards: PropTypes.array,
  rootHeader: PropTypes.any,
  rootFooter: PropTypes.any,
}

MenuBody.defaultProps = {
  wrapProps: {},
  CardComponent: MenuCard,
}

export default MenuBody
