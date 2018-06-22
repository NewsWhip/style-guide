export interface IPickerItem {
  id:any
  typeId?:any
  parentId:any
  displayName:string
  value:any
  added:boolean
  key?:string
  excluded?:boolean
  searchValues?:string[]
}