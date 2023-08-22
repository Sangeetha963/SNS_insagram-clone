import * as pluralize from 'pluralize'
import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm'
import { snakeCase } from 'typeorm/util/StringUtils'

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    override tableName(targetName: string, userSpecifiedName: string): string {
        return userSpecifiedName ? userSpecifiedName : snakeCase(targetName).replace(/_entities$/, '')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    override columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        return customName ? customName : snakeCase(propertyName)
    }

    override joinColumnName(relationName: string, referencedColumnName: string): string {
        return snakeCase(pluralize.singular(relationName) + '_' + referencedColumnName)
    }

    override joinTableName(
        firstTableName: string,
        secondTableName: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        firstPropertyName: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        secondPropertyName: string,
    ): string {
        return snakeCase(firstTableName + '_' + secondTableName)
    }

    override joinTableColumnName(tableName: string, propertyName: string, columnName: string): string {
        return snakeCase(pluralize.singular(tableName) + '_' + (columnName || propertyName))
    }
}
