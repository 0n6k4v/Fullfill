# from typing import List, Optional, Any, Dict
# from fastapi import APIRouter, Depends, HTTPException, Query, status
# from sqlalchemy.orm import Session

# from app.db.session import get_db
# from app.models.user import User
# from app.models.item import Item, ItemImage
# from app.schemas.item import Item as ItemSchema, ItemCreate, ItemUpdate, ItemList
# from app.services.item_service import ItemService
# from app.api.dependencies import get_current_user

# router = APIRouter()

# @router.get("/", response_model=ItemList)
# def read_items(
#     db: Session = Depends(get_db),
#     skip: int = Query(0, ge=0),
#     limit: int = Query(20, ge=1, le=100),
#     type_filter: Optional[str] = Query(None, alias="type"),
#     category: Optional[str] = Query(None),
#     condition: Optional[str] = Query(None),
#     search: Optional[str] = Query(None),
#     location: Optional[str] = Query(None),
#     status: Optional[int] = Query(None, ge=1, le=3),
#     date_filter: Optional[str] = Query(None)
# ):
#     """
#     Get all items with optional filtering.
#     """
#     items_data = ItemService.get_items(
#         db,
#         skip=skip,
#         limit=limit,
#         type_filter=type_filter,
#         category_filter=category,
#         condition_filter=condition,
#         search_query=search,
#         location_filter=location,
#         status_filter=status,
#         date_filter=date_filter
#     )

#     # Add user data to each item
#     for item in items_data["items"]:
#         # Get the uploader
#         uploader = db.query(User).filter(User.id == item.uploaded_by).first()
#         if uploader:
#             # Count how many items the user has shared
#             items_shared = db.query(Item).filter(Item.uploaded_by == uploader.id).count()
#             # Add user data to the item
#             item.user = {
#                 "id": uploader.id,
#                 "username": uploader.username,
#                 "full_name": uploader.full_name,
#                 "avatar": uploader.avatar or "/api/placeholder/50/50",  # Default avatar if none
#                 "rating": uploader.rating,
#                 "join_date": uploader.join_date,
#                 "items_shared": items_shared
#             }

#     return items_data

# @router.post("/", response_model=ItemSchema)
# def create_item(
#     item: ItemCreate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Create a new item (requires authentication).
#     """
#     # Create the item using the service
#     db_item = ItemService.create_item(db, item, current_user.id)

#     # Add user data to the item for the response
#     db_item.user = {
#         "id": current_user.id,
#         "username": current_user.username,
#         "full_name": current_user.full_name,
#         "avatar": current_user.avatar or "/api/placeholder/50/50",
#         "rating": current_user.rating,
#         "join_date": current_user.join_date,
#         "items_shared": db.query(Item).filter(Item.uploaded_by == current_user.id).count()
#     }

#     return db_item

# @router.get("/{item_id}", response_model=ItemSchema)
# def read_item(item_id: int, db: Session = Depends(get_db)):
#     """
#     Get a specific item by ID.
#     """
#     db_item = ItemService.get_item(db, item_id)
#     if not db_item:
#         raise HTTPException(status_code=404, detail="Item not found")

#     # Get the uploader
#     uploader = db.query(User).filter(User.id == db_item.uploaded_by).first()
#     if uploader:
#         # Count how many items the user has shared
#         items_shared = db.query(Item).filter(Item.uploaded_by == uploader.id).count()
#         # Add user data to the item
#         db_item.user = {
#             "id": uploader.id,
#             "username": uploader.username,
#             "full_name": uploader.full_name,
#             "avatar": uploader.avatar or "/api/placeholder/50/50",
#             "rating": uploader.rating,
#             "join_date": uploader.join_date,
#             "items_shared": items_shared
#         }

#     return db_item

# @router.put("/{item_id}", response_model=ItemSchema)
# def update_item(
#     item_id: int,
#     item_update: ItemUpdate,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Update an item (requires authentication and ownership).
#     """
#     # Check if the item exists
#     db_item = ItemService.get_item(db, item_id)
#     if not db_item:
#         raise HTTPException(status_code=404, detail="Item not found")

#     # Check if the current user is the owner
#     if db_item.uploaded_by != current_user.id and not current_user.is_superuser:
#         raise HTTPException(status_code=403, detail="Not enough permissions")

#     # Update the item
#     updated_item = ItemService.update_item(db, item_id, item_update)

#     # Add user data to the item for the response
#     updated_item.user = {
#         "id": current_user.id,
#         "username": current_user.username,
#         "full_name": current_user.full_name,
#         "avatar": current_user.avatar or "/api/placeholder/50/50",
#         "rating": current_user.rating,
#         "join_date": current_user.join_date,
#         "items_shared": db.query(Item).filter(Item.uploaded_by == current_user.id).count()
#     }

#     return updated_item

# @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_item(
#     item_id: int,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Delete an item (requires authentication and ownership).
#     """
#     # Check if the item exists
#     db_item = ItemService.get_item(db, item_id)
#     if not db_item:
#         raise HTTPException(status_code=404, detail="Item not found")

#     # Check if the current user is the owner or a superuser
#     if db_item.uploaded_by != current_user.id and not current_user.is_superuser:
#         raise HTTPException(status_code=403, detail="Not enough permissions")

#     # Delete the item
#     success = ItemService.delete_item(db, item_id)
#     if not success:
#         raise HTTPException(status_code=500, detail="Failed to delete item")

#     return {"status": "success"}

# @router.post("/{item_id}/status", response_model=ItemSchema)
# def change_item_status(
#     item_id: int,
#     status: int = Query(..., ge=1, le=3),
#     matched_user_id: Optional[int] = Query(None),
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     """
#     Change an item's status (requires authentication and ownership).
#     """
#     # Check if the item exists
#     db_item = ItemService.get_item(db, item_id)
#     if not db_item:
#         raise HTTPException(status_code=404, detail="Item not found")

#     # Check if the current user is the owner
#     if db_item.uploaded_by != current_user.id and not current_user.is_superuser:
#         raise HTTPException(status_code=403, detail="Not enough permissions")

#     # Update status
#     updated_item = ItemService.change_item_status(db, item_id, status, matched_user_id)

#     # Add user data to the item for the response
#     uploader = db.query(User).filter(User.id == updated_item.uploaded_by).first()
#     if uploader:
#         items_shared = db.query(Item).filter(Item.uploaded_by == uploader.id).count()
#         updated_item.user = {
#             "id": uploader.id,
#             "username": uploader.username,
#             "full_name": uploader.full_name,
#             "avatar": uploader.avatar or "/api/placeholder/50/50",
#             "rating": uploader.rating,
#             "join_date": uploader.join_date,
#             "items_shared": items_shared
#         }

#     return updated_item

# @router.get("/{item_id}/similar", response_model=List[ItemSchema])
# def get_similar_items(
#     item_id: int,
#     limit: int = Query(3, ge=1, le=10),
#     db: Session = Depends(get_db)
# ):
#     """
#     Get similar items based on the item's category.
#     """
#     # Check if the item exists
#     db_item = ItemService.get_item(db, item_id)
#     if not db_item:
#         raise HTTPException(status_code=404, detail="Item not found")

#     # Get similar items
#     similar_items = ItemService.get_similar_items(db, item_id, db_item.category, limit)

#     # Add user data to each item
#     for item in similar_items:
#         uploader = db.query(User).filter(User.id == item.uploaded_by).first()
#         if uploader:
#             items_shared = db.query(Item).filter(Item.uploaded_by == uploader.id).count()
#             item.user = {
#                 "id": uploader.id,
#                 "username": uploader.username,
#                 "full_name": uploader.full_name,
#                 "avatar": uploader.avatar or "/api/placeholder/50/50",
#                 "rating": uploader.rating,
#                 "join_date": uploader.join_date,
#                 "items_shared": items_shared
#             }

#     return similar_items
