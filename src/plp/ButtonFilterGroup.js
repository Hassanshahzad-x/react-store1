import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import React, { useMemo, useContext } from 'react'
import SearchResultsContext from './SearchResultsContext'
import SwatchProductOption from '../option/SwatchProductOption'
import TextProductOption from '../option/TextProductOption'
import { Hbox } from '../Box'

const PREFIX = 'RSFButtonFilterGroup'

const defaultClasses = {
  root: `${PREFIX}-root`,
  matches: `${PREFIX}-matches`,
  button: `${PREFIX}-button`,
}

const Root = styled('div')(({ theme }) => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  /**
   * Styles applied to the matching text.
   */
  [`& .${defaultClasses.matches}`]: {
    display: 'inline',
    ...theme.typography.caption,
    marginLeft: 2,
    color: theme.palette.grey[700],
  },

  /**
   * Styles applied to each button element.
   */
  [`& .${defaultClasses.button}`]: {
    fontWeight: 'normal',
    margin: theme.spacing(0, 0.5, 0.5, 0),
  },
}))

/**
 * A UI for grouping filters using buttons.
 */
export default function ButtonFilterGroup(props) {
  const { group, submitOnChange, classes: c = {} } = props
  const {
    pageData: { filters },
    actions: { toggleFilter },
  } = useContext(SearchResultsContext)
  const classes = { ...defaultClasses, ...c }

  return useMemo(
    () => (
      <Root className={classes.root}>
        {group.options.map((facet, i) => {
          const selected = filters.indexOf(facet.code) !== -1
          const { image, matches, name } = facet
          const handleClick = () => toggleFilter(facet, submitOnChange)
          const Variant = image ? SwatchProductOption : TextProductOption

          return (
            <Variant
              key={i}
              classes={{ root: classes.button }}
              selected={selected}
              onClick={handleClick}
              label={
                <Hbox>
                  <span>{name}</span>
                  {matches ? <span className={classes.matches}>({matches})</span> : null}
                </Hbox>
              }
              {...(image ? { imageProps: facet.image } : undefined)}
            />
          )
        })}
      </Root>
    ),
    [filters, ...Object.values(props)],
  )
}

ButtonFilterGroup.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * Contains data for the group to be rendered.
   */
  group: PropTypes.shape({
    options: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string,
        name: PropTypes.string,
        matches: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        image: PropTypes.object,
      }),
    ),
  }),
  /**
   * Set to `true` if the filters will be submitted when changed. In this case, the footer will not be shown.
   */
  submitOnChange: PropTypes.bool,
}
