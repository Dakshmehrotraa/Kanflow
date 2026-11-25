import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { workspaceApi, cardApi } from '../api/endpoints.js';
import { useToast } from './ToastContext.jsx';

const BoardContext = createContext(null);
export const useBoard = () => useContext(BoardContext);

const initial = {
  workspaces: [],
  activeId: null,
  cards: [],
  columns: [],
  loading: true,
  filter: 'all',
  search: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_WORKSPACES':
      return { ...state, workspaces: action.list, loading: false };
    case 'SET_ACTIVE':
      return { ...state, activeId: action.id };
    case 'SET_BOARD': // columns + cards for the active workspace
      return { ...state, columns: action.columns, cards: action.cards };
    case 'UPSERT_CARD': {
      const exists = state.cards.some((c) => c._id === action.card._id);
      return {
        ...state,
        cards: exists
          ? state.cards.map((c) => (c._id === action.card._id ? action.card : c))
          : [...state.cards, action.card],
      };
    }
    case 'REMOVE_CARD':
      return { ...state, cards: state.cards.filter((c) => c._id !== action.id) };
    case 'SET_COLUMNS':
      return { ...state, columns: action.columns };
    case 'ADD_WORKSPACE':
      return { ...state, workspaces: [action.ws, ...state.workspaces] };
    case 'REMOVE_WORKSPACE':
      return { ...state, workspaces: state.workspaces.filter((w) => w._id !== action.id) };
    case 'PATCH_WORKSPACE':
      return {
        ...state,
        workspaces: state.workspaces.map((w) =>
          w._id === action.ws._id ? { ...w, ...action.ws } : w
        ),
      };
    case 'FILTER':
      return { ...state, filter: action.value };
    case 'SEARCH':
      return { ...state, search: action.value };
    default:
      return state;
  }
}

export function BoardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const toast = useToast();

  // Load the user's workspaces once.
  useEffect(() => {
    workspaceApi
      .list()
      .then((list) => {
        dispatch({ type: 'SET_WORKSPACES', list });
        if (list.length) selectWorkspace(list[0]._id);
      })
      .catch((e) => toast(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectWorkspace = useCallback(async (id) => {
    dispatch({ type: 'SET_ACTIVE', id });
    try {
      const ws = await workspaceApi.get(id); // returns workspace + cards
      dispatch({ type: 'SET_BOARD', columns: ws.columns || [], cards: ws.cards || [] });
    } catch (e) { toast(e.message); }
  }, [toast]);

  const createWorkspace = useCallback(async (name, color) => {
    const ws = await workspaceApi.create(name, color);
    dispatch({ type: 'ADD_WORKSPACE', ws });
    selectWorkspace(ws._id);
    toast('Workspace created');
  }, [selectWorkspace, toast]);

  const deleteWorkspace = useCallback(async (id) => {
    await workspaceApi.remove(id);
    dispatch({ type: 'REMOVE_WORKSPACE', id });
    toast('Workspace deleted');
  }, [toast]);

  const saveColumns = useCallback(async (columns) => {
    dispatch({ type: 'SET_COLUMNS', columns });
    const ws = await workspaceApi.update(state.activeId, { columns });
    dispatch({ type: 'PATCH_WORKSPACE', ws });
  }, [state.activeId]);

  const saveCard = useCallback(async (data, cardId) => {
    const card = cardId
      ? await cardApi.update(state.activeId, cardId, data)
      : await cardApi.create(state.activeId, data);
    dispatch({ type: 'UPSERT_CARD', card });
    toast(cardId ? 'Task updated' : 'Task added');
  }, [state.activeId, toast]);

  const deleteCard = useCallback(async (cardId) => {
    await cardApi.remove(state.activeId, cardId);
    dispatch({ type: 'REMOVE_CARD', id: cardId });
    toast('Task deleted');
  }, [state.activeId, toast]);

  const moveCard = useCallback(async (cardId, column, order) => {
    // optimistic update
    const current = state.cards.find((c) => c._id === cardId);
    if (current) dispatch({ type: 'UPSERT_CARD', card: { ...current, column, order } });
    try {
      const card = await cardApi.move(state.activeId, cardId, { column, order });
      dispatch({ type: 'UPSERT_CARD', card });
    } catch (e) { toast(e.message); }
  }, [state.activeId, state.cards, toast]);

  const setFilter = useCallback((value) => dispatch({ type: 'FILTER', value }), []);
  const setSearch = useCallback((value) => dispatch({ type: 'SEARCH', value }), []);

  const activeWorkspace = state.workspaces.find((w) => w._id === state.activeId) || null;

  return (
    <BoardContext.Provider
      value={{
        ...state,
        activeWorkspace,
        selectWorkspace,
        createWorkspace,
        deleteWorkspace,
        saveColumns,
        saveCard,
        deleteCard,
        moveCard,
        setFilter,
        setSearch,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}
