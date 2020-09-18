import subscription from 'utils/subscription'

const columnTypes = ['string', 'enum'] as const
type ColumnType = typeof columnTypes[number]
export type Columns = { [c: string]: ColumnType }

export class Filter {
  constructor(
    public readonly columns: Columns,
    public readonly id = Date.now() + ((Math.random() * 1e5) | 0)
  ) {}

  private _column?: string
  private _action?: string
  private readonly columnSub = subscription<string | undefined>()
  private readonly actionSub = subscription<string | undefined>()

  public get column() {
    return this._column
  }

  public set column(v: string | undefined) {
    this._column = v
    this.columnSub._call(v)
    this.action = undefined
  }

  public onColumnChange = this.columnSub.subscribe

  public get action() {
    return this._action
  }

  public set action(v: string | undefined) {
    this._action = v
    this.actionSub._call(v)
  }

  public onActionChange = this.actionSub.subscribe

  static actions(type: ColumnType): string[] {
    switch (type) {
      case 'string':
        return ['begins_with']
      case 'enum':
        return ['equals']
      default:
        throw new Error(`unknown filter type ${type}`)
    }
  }
}
