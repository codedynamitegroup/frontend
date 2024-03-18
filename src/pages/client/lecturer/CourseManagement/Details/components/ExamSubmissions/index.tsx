import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import {
  GridCallbackDetails,
  GridColDef,
  GridColumnGroupingModel,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import CustomDataGrid from "components/common/CustomDataGrid";
import Button, { BtnType } from "components/common/buttons/Button";
import LoadButton from "components/common/buttons/LoadingButton";
import Heading1 from "components/text/Heading1";
import ParagraphBody from "components/text/ParagraphBody";
import TextTitle from "components/text/TextTitle";
import { useNavigate } from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import ExamSubmissionFeatureBar from "./components/FeatureBar";
import SubmissionBarChart from "./components/SubmissionChart";
import classes from "./styles.module.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

export enum SubmissionStatusSubmitted {
  SUBMITTED = "Đã nộp",
  NOT_SUBMITTED = "Chưa nộp"
}

export enum SubmissionStatusGraded {
  GRADED = "Đã chấm",
  NOT_GRADED = "Chưa chấm"
}

const LecturerCourseExamSubmissions = () => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(() => {
    return i18next.language;
  });
  const navigate = useNavigate();
  const totalSubmissionCount = 20;
  const totalStudent = 30;
  const visibleColumnList = { id: false, name: true, email: true, role: true, action: true };
  const dataGridToolbar = { enableToolbar: true };
  const rowSelectionHandler = (
    selectedRowId: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    console.log(selectedRowId);
  };
  const pageChangeHandler = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {
    console.log(model);
  };
  const page = 0;
  const pageSize = 5;
  const totalElement = 100;
  const [isPlagiarismDetectionLoading, setIsPlagiarismDetectionLoading] = useState(false);

  const fetchPlagiarismDetectionForCodeQuestion = async (questionId: string) => {
    const codePlagiarismDetectionApiUrl =
      process.env.REACT_APP_CODE_PLAGIARISM_DETECTION_API_URL || "";
    setIsPlagiarismDetectionLoading(true);
    // Maybe fetch data from server
    const codeSubmissionsData = {
      report_name: "Câu hỏi 1 - Kiểm tra cuối kỳ",
      language: "python",
      question_id: "1",
      question_name: "Câu hỏi 1",
      code_submissions_data: [
        {
          content: `
          from collections import defaultdict

import numpy as np
import sys

class DistanceMatrix:
    def __init__(self, *args):
        self.D = np.array(*args)
        return

    def __str__(self):
        return str([[float(a) for a in x] for x in self.D])

    def __repr__(self):
        return type(self).__name__ + "(" + str([[float(a) for a in x] for x in self.D]) + ")"

    @staticmethod
    def loadtxt(file_name, dtype=None,F comments='#', delimiter=None, converters=None, skiprows=0, usecols=None, unpack=False, ndmin=0):
        D = np.loadtxt(file_name, dtype, comments, delimiter, converters, skiprows, usecols, unpack, ndmin)
        return DistanceMatrix(D)

    def savetxt(self, output_file, fmt='%.18e', delimiter=' ', newline='\n', header='', footer='', comments='# '):
        np.savetxt(output_file, self.D, fmt, delimiter, newline, header, footer, comments)
        return

    def nr_leaves(self):
        return len(self.D)

    def limb_length(self, j):
        n = self.nr_leaves()
        assert(j < n)
        minimum = sys.maxsize
        for i in range(n):
            if i != j:
                for k in range(n):
                    if k != j:
                        Dij = self.D[i][j]
                        Djk = self.D[j][k]
                        Dik = self.D[i][k]
                        minimum = min([minimum, (Dij+Djk-Dik)/2])
        return minimum

    def additive_phylogeny(self):
        self.node_count = self.nr_leaves()
        return self.additive_phylogeny_rec(self, self.nr_leaves())

    def find_i_n_k(self, n):
        for i in range(n-1):
            for k in range(n-1):
                if i != k:
                    if self.D[i][k] == self.D[i][n-1] + self.D[n-1][k]:
                        return (i, n, k)
        return "nop"

    def additive_phylogeny_rec(self, D, n):
        if n == 3:
            ll1 = (D.D[0][1] + D.D[1][2] - D.D[0][2])/2
            ll2 = D.D[1][2] - ll1
            ll0 = D.D[0][1] - ll1
            edges = {(0, self.node_count, ll0), (1, self.node_count, ll1), (2, self.node_count, ll2)}
            self.node_count += 1
            return UnrootedTree(*edges)

        ll = D.limb_length(n-1)
        D_bald = DistanceMatrix(D.D[:])
        for x in range(n-1):
            D_bald.D[n-1][x] -= ll
            D_bald.D[x][n-1] -= ll

        i,n,k = D_bald.find_i_n_k(n)
        x = D_bald.D[i][n-1]
        trimmed_D = DistanceMatrix([[D_bald.D[a][b] for a in range(n-1)] for b in range(n-1)])
        T = self.additive_phylogeny_rec(trimmed_D, n-1)
        path = T.path(i,k)
        i = 1
        while i < len(path) -1 and T.distance(path[0],path[i]) < x:
            i += 1

        if i is not 0 and  T.distance(path[0],path[i]) == x:
            T.add_edge(path[i-1],n-1,ll)
        else:
            a,b = path[i-1],path[i]
            new_d = D.D[path[0]][b] - x if b < len(D.D) else T.distance(path[0],b) - x
            T.add_edge(self.node_count, b, new_d)
            T.add_edge(a, self.node_count, T.distance(a,b) - new_d)
            T.add_edge(n-1, self.node_count, ll)
            T.remove_edge(a, b)
            self.node_count += 1

        return T

    def UPGMA(self):
        self.nr_count = self.nr_leaves()
        clusters = [{i} for i in range(self.nr_leaves())]
        trees = [Tree(i) for i in range(self.nr_leaves())]
        ages = [0 for _ in range(self.nr_leaves())]
        while len(clusters) > 1:
            min_d = sys.maxsize
            min_C1, min_C2 = None, None
            n = len(clusters)
            for i in range(n):
                for j in range(i+1,n):
                    C1, C2 = clusters[i], clusters[j]
                    d = self.pairwise_distance(C1,C2)
                    if d < min_d:
                        min_d = d
                        min_C1, min_C2 = C1, C2

            C1_index, C2_index = clusters.index(min_C1), clusters.index(min_C2)
            age = min_d/2
            clusters[C1_index] = min_C1 | min_C2
            clusters.pop(C2_index)
            trees[C1_index] = Tree(self.nr_count, (trees[C1_index], age - ages[C1_index]), (trees[C2_index], age - ages[C2_index] ))
            trees.pop(C2_index)
            ages[C1_index] = age
            ages.pop(C2_index)
            self.nr_count += 1
        return trees[0]

    def pairwise_distance(self,C1, C2):
        n, m = len(C1), len(C2)
        s = sum([self.D[i][j] for i in C1 for j in C2])
        return s/(n*m)

class UnrootedTree:
    def __init__(self, *edges):
        self.edges = list()
        for edge in edges:
            a,b,c = edge
            a, b, c = int(a), int(b), float(c)
            self.edges.append((a,b,c))
        d = dict()
        for edge in self.edges:
            x, y, w = edge
            d[(x, y)] = w
            d[(y, x)] = w
        self.d = d
        nb = defaultdict(list)
        for edge in self.edges:
            x, y, w = edge
            nb[x].append(y)
            nb[y].append(x)
        self.nb = nb

    def __str__(self):
        return type(self).__name__ + str(tuple(self.edges))

    def __repr__(self):
        return type(self).__name__ + str(tuple(self.edges))

    def add_edge(self, a,b,w):
        self.edges.append((a,b,w))
        self.d[(a,b)] = w
        self.d[(b,a)] = w
        self.nb[a].append(b)
        self.nb[b].append(a)

    def remove_edge(self,a,b):
        for edge in self.edges:
            x,y,w = edge
            if (x == a and b == y) or (x == b and y == a):
                self.edges.remove(edge)
                break
        del self.d[(a,b)]
        del self.d[(b,a)]
        self.nb[a].remove(b)
        self.nb[b].remove(a)

    @staticmethod
    def loadtxt(input_file):
        edges = list()
        f = open(input_file)
        for line in f:
            line = line.rstrip().split(":")
            line[0] = line[0].split("<->")
            edges.append((line[0][0],line[0][1],line[1]))

        return UnrootedTree(*edges)

    def path(self, i, j):
        self.visited = [i]
        p = self.path_dfs(self.nb, i, j, [i])
        if p[0] != i:
            p = p [::-1]
        return p

    def distance(self, i,j):
        if (i,j) in self.d:
            return self.d[(i,j)]
        else:
            path = self.path(i,j)
            return self.path_weight(path)

    def path_dfs(self, graph, current_i, j, current_path):
        nb = graph[current_i]
        for n in nb:
            if n not in self.visited:
                self.visited.append(n)
                if n == j:
                    return current_path + [j]
                else:
                    r = self.path_dfs(graph, n, j, current_path + [n])
                    if r:
                        return r

    def nr_leaf_nodes(self):
        s = set()
        for edge in self.edges:
            x,y,w = edge
            if len(self.nb[x]) == 1:
                s.add(x)
            if len(self.nb[y]) == 1:
                s.add(y)
        return len(s)

    def path_weight(self, path):
        s = 0
        for i in range(len(path) -1):
            s += self.d[(path[i],path[i+1])]
        return s

    def distance_matrix(self):
        n = self.nr_leaf_nodes()
        D = [[0 for _ in range(n)] for _ in range(n)]
        self.path_weight(self.path(0,2))
        for i in range(n):
            for j in range(i+1,n):
                path = self.path(i,j)
                w = self.path_weight(path)
        D[i][j], D[j][i] = w, w
        return DistanceMatrix(D)

class Tree:
    def __init__(self, root, *subtrees):
        self.root = root
        self.subtrees = subtrees

    def __str__(self):
        subtrees_str = ", ".join([str(tree) for tree in self.subtrees])
        return type(self).__name__ + "(" + str(self.root) + (", " if len(self.subtrees) > 0 else "") + subtrees_str + ")"

    def __repr__(self):
        return self.__str__()`,
          extra: {
            submission_id: "1",
            student_id: "20127001",
            created_at: "2023-07-23 17:12:33 +0200",
            labels: "test"
          }
        },
        {
          content: `from collections import defaultdict

          import numpy as np
          import sys
          
          #from A, except some functions
          class DistanceMatrix:
              def __init__(self, *args):
                  self.D = np.array(*args)
                  return
          
              def __str__(self):
                  return str([[float(a) for a in x] for x in self.D])
          
              def __repr__(self):
                  return type(self).__name__ + "(" + str([[float(a) for a in x] for x in self.D]) + ")"
          
              @staticmethod
              def loadtxt(file_name, dtype=None, comments='#', delimiter=None, converters=None, skiprows=0, usecols=None, unpack=False, ndmin=0):
                  D = np.loadtxt(file_name, dtype, comments, delimiter, converters, skiprows, usecols, unpack, ndmin)
                  return DistanceMatrix(D)
          
              def savetxt(self, output_file, fmt='%.18e', delimiter=' ', newline='\n', header='', footer='', comments='# '):
                  np.savetxt(output_file, self.D, fmt, delimiter, newline, header, footer, comments)
                  return
          
              def nr_leaves(self):
                  return len(self.D)
          
              def limb_length(self, j):
                  n = self.nr_leaves()
                  assert(j < n)
                  minimum = sys.maxsize
                  for i in range(n):
                      if i != j:
                          for k in range(n):
                              if k != j:
                                  Dij = self.D[i][j]
                                  Djk = self.D[j][k]
                                  Dik = self.D[i][k]
                                  minimum = min([minimum, (Dij+Djk-Dik)/2])
                  return minimum
          
              #from B
              def additive_phylogeny(self):
                  self.max_node = len(self.matrix)
                  return UnrootedTree(*sorted(self.additive_phylogeny_recursive(self.matrix, len(self.matrix))))
          
              #from B
              def additive_phylogeny_recursive(self, mat, n):
                  if n == 2:
                      return [(0, 1, mat[0][1])]
                  limb_size = DistanceMatrix.limb_length_from_matrix(mat[:n, :n], n - 1)
                  for j in range(n - 1):
                      mat[n - 1][j] = mat[n - 1][j] - limb_size
                      mat[j][n - 1] = mat[n - 1][j]
                  for i in range(n - 1):
                      found = False
                      for k in range(i, n - 1):
                          if mat[i][k] == mat[i][n - 1] + mat[k][n - 1]:
                              found = True
                              break
                      if found:
                          break
                  x = mat[i][n - 1]
                  tree_list = self.additive_phylogeny_recursive(mat.copy(), n - 1)
                  tree = UnrootedTree(*tree_list)
                  path = tree.path(i, k)
                  for j in range(1, len(path)):
                      edge = (path[j - 1], path[j])
                      edge_sorted = tuple(sorted(edge))
                      if tree.edges[edge_sorted] > x:
                          tree_list.remove((edge_sorted[0], edge_sorted[1], tree.edges[edge_sorted]))
                          tree_list.append((edge[0], self.max_node, x))
                          tree_list.append((edge[1], self.max_node, tree.edges[edge_sorted] - x))
                          tree_list.append((n - 1, self.max_node, limb_size))
                          self.max_node += 1
                          break
                      elif tree.edges[edge_sorted] == x:
                          new_edge = sorted((n - 1, edge[1]))
                          tree_list.append((new_edge[0], new_edge[1], limb_size))
                          break
                      else:
                          x -= tree.edges[edge_sorted]
          
                  return tree_list
          
              def UPGMA(self):
                  self.nr_count = self.nr_leaves()
                  clusters = [{i} for i in range(self.nr_leaves())]
                  trees = [Tree(i) for i in range(self.nr_leaves())]
                  ages = [0 for _ in range(self.nr_leaves())]
                  while len(clusters) > 1:
                      min_d = sys.maxsize
                      min_C1, min_C2 = None, None
                      n = len(clusters)
                      for i in range(n):
                          for j in range(i+1,n):
                              C1, C2 = clusters[i], clusters[j]
                              d = self.pairwise_distance(C1,C2)
                              if d < min_d:
                                  min_d = d
                                  min_C1, min_C2 = C1, C2
          
                      C1_index, C2_index = clusters.index(min_C1), clusters.index(min_C2)
                      age = min_d/2
                      clusters[C1_index] = min_C1 | min_C2
                      clusters.pop(C2_index)
                      trees[C1_index] = Tree(self.nr_count, (trees[C1_index], age - ages[C1_index]), (trees[C2_index], age - ages[C2_index] ))
                      trees.pop(C2_index)
                      ages[C1_index] = age
                      ages.pop(C2_index)
                      self.nr_count += 1
                  return trees[0]
          
              def pairwise_distance(self,C1, C2):
                  n, m = len(C1), len(C2)
                  s = sum([self.D[i][j] for i in C1 for j in C2])
                  return s/(n*m)
          
          #from B completely
          class UnrootedTree:
          
              def __init__(self, *args):
                  self.graph = defaultdict(set)
                  self.edges = defaultdict(int)
                  self.nodes = set()
                  self.edges_list = list()
                  self.leaves = set()
                  for tup in args:
                      self.graph[tup[0]].add((tup[1]))
                      self.graph[tup[1]].add((tup[0]))
                      self.edges[tuple(sorted((tup[0], tup[1])))] = tup[2]
                      self.edges_list.append((tup[0], tup[1], float(tup[2])))
                      self.nodes.add(tup[0])
                      self.nodes.add(tup[1])
                  for key, val in self.graph.items():
                      if len(val) == 1:
                          self.leaves.add(key)
          
              def __repr__(self):
                  repr_str = "UnrootedTree("
                  for edge in self.edges_list:
                      repr_str += str(edge) + ", "
                  return repr_str[:-2] + ")"
          
              @staticmethod
              def loadtxt(f):
                  with open(f, "r") as graph_file:
                      tuple_list = []
                      for line in graph_file:
                          line_arr = line.strip().split("<->")
                          rhs = line_arr[1].split(":")
                          tuple_list.append((int(line_arr[0]), int(rhs[0]), float(rhs[1])))
                      return UnrootedTree(*tuple_list)
          
              def path(self, first_node, second_node):
                  stack = [(first_node, [first_node])]
                  while stack:
                      (vertex, path) = stack.pop()
                      for next_vertex in self.graph[vertex] - set(path):
                          if next_vertex == second_node:
                              return path + [next_vertex]
                          else:
                              stack.append((next_vertex, path + [next_vertex]))
          
              def distance_matrix(self):
                  mat = [[0 for _ in range(len(self.leaves))] for _ in range(len(self.leaves))]
                  for n1 in self.leaves:
                      for n2 in self.leaves:
                          if n1 < n2:
                              path = self.path(n1, n2)
                              length = 0
                              for i in range(1, len(path)):
                                  length += self.edges[tuple(sorted((path[i - 1], path[i])))]
                              mat[n1][n2] = length
                              mat[n2][n1] = length
                  return DistanceMatrix(mat)
          
          #from A
          class Tree:
              def __init__(self, root, *subtrees):
                  self.root = root
                  self.subtrees = subtrees
          
              def __str__(self):
                  subtrees_str = ", ".join([str(tree) for tree in self.subtrees])
                  return type(self).__name__ + "(" + str(self.root) + (", " if len(self.subtrees) > 0 else "") + subtrees_str + ")"
          
              def __repr__(self):
                  return self.__str__()`,
          extra: {
            submission_id: "2",
            student_id: "20127002",
            created_at: "2023-07-23 17:12:33 +0200",
            labels: "test"
          }
        },
        {
          content: `from collections import defaultdict

          import numpy as np
          import sys
          
          class DistanceMatrix:
              def __init__(self, *args):
                  self.D = np.array(*args)
                  return
          
              def __str__(self):
                  return str([[float(a) for a in x] for x in self.D])
          
              def __repr__(self):
                  return type(self).__name__ + "(" + str([[float(a) for a in x] for x in self.D]) + ")"
          
              @staticmethod
              def loadtxt(file_name, dtype=None, comments='#', delimiter=None, converters=None, skiprows=0, usecols=None, unpack=False, ndmin=0):
                  D = np.loadtxt(file_name, dtype, comments, delimiter, converters, skiprows, usecols, unpack, ndmin)
                  return DistanceMatrix(D)
          
              def savetxt(self, output_file, fmt='%.18e', delimiter=' ', newline='\n', header='', footer='', comments='# '):
                  np.savetxt(output_file, self.D, fmt, delimiter, newline, header, footer, comments)
                  return
          
              def nr_leaves(self):
                  return len(self.D)
          
              def limb_length(self, j):
                  n = self.nr_leaves()
                  assert(j < n)
                  minimum = sys.maxsize
                  for i in range(n):
                      if i != j:
                          for k in range(n):
                              if k != j:
                                  # next 3 lines are shuffled
                                  Dik = self.D[i][k]
                                  Djk = self.D[j][k]
                                  Dij = self.D[i][j]
                                  minimum = min([minimum, (Dij+Djk-Dik)/2])
                  return minimum
          
              def additive_phylogeny(self):
                  self.node_count = self.nr_leaves()
                  return self.additive_phylogeny_rec(self, self.nr_leaves())
          
              def find_i_n_k(self, n):
                  for i in range(n-1):
                      for k in range(n-1):
                          if i != k:
                              if self.D[i][k] == self.D[i][n-1] + self.D[n-1][k]:
                                  return (i, n, k)
                  return "nop"
          
              def additive_phylogeny_rec(self, D, n):
                  if n == 3:
                      ll1 = (D.D[0][1] + D.D[1][2] - D.D[0][2])/2
                      ll2 = D.D[1][2] - ll1
                      ll0 = D.D[0][1] - ll1
                      edges = {(0, self.node_count, ll0), (1, self.node_count, ll1), (2, self.node_count, ll2)}
                      self.node_count += 1
                      return UnrootedTree(*edges)
          
                  ll = D.limb_length(n-1)
                  D_bald = DistanceMatrix(D.D[:])
                  for x in range(n-1):
                      # next two lines are switched
                      D_bald.D[x][n-1] -= ll
                      D_bald.D[n-1][x] -= ll
          
                  i,n,k = D_bald.find_i_n_k(n)
                  x = D_bald.D[i][n-1]
                  trimmed_D = DistanceMatrix([[D_bald.D[a][b] for a in range(n-1)] for b in range(n-1)])
                  T = self.additive_phylogeny_rec(trimmed_D, n-1)
                  path = T.path(i,k)
                  i = 1
                  while i < len(path) -1 and T.distance(path[0],path[i]) < x:
                      i += 1
          
                  if i is not 0 and  T.distance(path[0],path[i]) == x:
                      T.add_edge(path[i-1],n-1,ll)
                  else:
                      a,b = path[i-1],path[i]
                      new_d = D.D[path[0]][b] - x if b < len(D.D) else T.distance(path[0],b) - x
                      T.add_edge(self.node_count, b, new_d)
                      T.add_edge(a, self.node_count, T.distance(a,b) - new_d)
                      T.add_edge(n-1, self.node_count, ll)
                      T.remove_edge(a, b)
                      self.node_count += 1
          
                  return T
          
              def UPGMA(self):
                  self.nr_count = self.nr_leaves()
                  clusters = [{i} for i in range(self.nr_leaves())]
                  trees = [Tree(i) for i in range(self.nr_leaves())]
                  ages = [0 for _ in range(self.nr_leaves())]
                  while len(clusters) > 1:
                      min_d = sys.maxsize
                      min_C1, min_C2 = None, None
                      n = len(clusters)
                      for i in range(n):
                          for j in range(i+1,n):
                              C1, C2 = clusters[i], clusters[j]
                              d = self.pairwise_distance(C1,C2)
                              if d < min_d:
                                  min_d = d
                                  min_C1, min_C2 = C1, C2
          
                      C1_index, C2_index = clusters.index(min_C1), clusters.index(min_C2)
                      age = min_d/2
                      clusters[C1_index] = min_C1 | min_C2
                      clusters.pop(C2_index)
                      trees[C1_index] = Tree(self.nr_count, (trees[C1_index], age - ages[C1_index]), (trees[C2_index], age - ages[C2_index] ))
                      trees.pop(C2_index)
                      ages[C1_index] = age
                      ages.pop(C2_index)
                      self.nr_count += 1
                  return trees[0]
          
              def pairwise_distance(self,C1, C2):
                  n, m = len(C1), len(C2)
                  s = sum([self.D[i][j] for i in C1 for j in C2])
                  return s/(n*m)
          
          class UnrootedTree:
              def __init__(self, *edges):
                  self.edges = list()
                  for edge in edges:
                      a,b,c = edge
                      a, b, c = int(a), int(b), float(c)
                      self.edges.append((a,b,c))
                  d = dict()
                  for edge in self.edges:
                      x, y, w = edge
                      #next two lines are switched
                      d[(y, x)] = w
                      d[(x, y)] = w
                  self.d = d
                  nb = defaultdict(list)
                  for edge in self.edges:
                      x, y, w = edge
                      # next two lines are switched
                      nb[y].append(x)
                      nb[x].append(y)
                  self.nb = nb
          
              def __str__(self):
                  return type(self).__name__ + str(tuple(self.edges))
          
              def __repr__(self):
                  return type(self).__name__ + str(tuple(self.edges))
          
              def add_edge(self, a,b,w):
                  self.edges.append((a,b,w))
                  self.d[(a,b)] = w
                  self.d[(b,a)] = w
                  self.nb[a].append(b)
                  self.nb[b].append(a)
          
              def remove_edge(self,a,b):
                  for edge in self.edges:
                      x,y,w = edge
                      if (x == a and b == y) or (x == b and y == a):
                          self.edges.remove(edge)
                          break
                  # deletion order is switched
                  del self.d[(b,a)]
                  del self.d[(a,b)]
                  self.nb[b].remove(a)
                  self.nb[a].remove(b)
          
              @staticmethod
              def loadtxt(input_file):
                  edges = list()
                  f = open(input_file)
                  for line in f:
                      line = line.rstrip().split(":")
                      line[0] = line[0].split("<->")
                      edges.append((line[0][0],line[0][1],line[1]))
          
                  return UnrootedTree(*edges)
          
              def path(self, i, j):
                  self.visited = [i]
                  p = self.path_dfs(self.nb, i, j, [i])
                  if p[0] != i:
                      p = p [::-1]
                  return p
          
              def distance(self, i,j):
                  if (i,j) in self.d:
                      return self.d[(i,j)]
                  else:
                      path = self.path(i,j)
                      return self.path_weight(path)
          
              def path_dfs(self, graph, current_i, j, current_path):
                  nb = graph[current_i]
                  for n in nb:
                      if n not in self.visited:
                          self.visited.append(n)
                          if n == j:
                              return current_path + [j]
                          else:
                              r = self.path_dfs(graph, n, j, current_path + [n])
                              if r:
                                  return r
          
              def nr_leaf_nodes(self):
                  s = set()
                  for edge in self.edges:
                      x,y,w = edge
                      #these two if cases have been switched
                      if len(self.nb[y]) == 1:
                          s.add(y)
                      if len(self.nb[x]) == 1:
                          s.add(x)
                  return len(s)
          
              def path_weight(self, path):
                  s = 0
                  for i in range(len(path) -1):
                      s += self.d[(path[i],path[i+1])]
                  return s
          
              def distance_matrix(self):
                  n = self.nr_leaf_nodes()
                  D = [[0 for _ in range(n)] for _ in range(n)]
                  self.path_weight(self.path(0,2))
                  for i in range(n):
                      for j in range(i+1,n):
                          path = self.path(i,j)
                          w = self.path_weight(path)
                  D[i][j], D[j][i] = w, w
                  return DistanceMatrix(D)
          
          class Tree:
              def __init__(self, root, *subtrees):
                  self.root = root
                  self.subtrees = subtrees
          
              def __str__(self):
                  subtrees_str = ", ".join([str(tree) for tree in self.subtrees])
                  return type(self).__name__ + "(" + str(self.root) + (", " if len(self.subtrees) > 0 else "") + subtrees_str + ")"
          
              def __repr__(self):
                  return self.__str__()`,
          extra: {
            submission_id: "3",
            student_id: "20127002",
            created_at: "2023-07-23 17:12:33 +0200",
            labels: "test"
          }
        }
      ]
    };

    try {
      const response = await axios.post(codePlagiarismDetectionApiUrl, codeSubmissionsData);
      setIsPlagiarismDetectionLoading(false);
      return response.data;
    } catch (error) {
      setIsPlagiarismDetectionLoading(false);
      throw error;
    }
  };

  const onHandlePlagiarismDetection = async (questionId: string) => {
    try {
      const result = await fetchPlagiarismDetectionForCodeQuestion(questionId);
      if (result.status === "success") {
        navigate(`${routes.lecturer.exam.code_plagiarism_detection}?questionId=${questionId}`, {
          state: {
            report: result.data
          }
        });
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const examData = {
    id: 1,
    max_grade: 30,
    questions: [
      {
        id: "1",
        question: "Câu hỏi 1",
        answer: "Đáp án 1",
        max_grade: 10,
        type: qtype.source_code,
        plagiarism_detection: {
          is_checked: true,
          result: {
            is_plagiarism: true,
            plagiarism_rate: 0.5
          }
        }
      },
      {
        id: "2",
        question: "Câu hỏi 2",
        answer: "Đáp án 2",
        max_grade: 10,
        type: qtype.essay
      },
      {
        id: "3",
        question: "Câu hỏi 3",
        answer: "Đáp án 3",
        max_grade: 10,
        type: qtype.multiple_choice
      }
    ]
  };

  const submissionList = [
    {
      id: 1,
      student_name: "Nguyễn Đinh Quang Khánh",
      student_email: "khanhndq2002@gmail.com",
      status: {
        submission_status_submitted: SubmissionStatusSubmitted.SUBMITTED,
        grade_status: SubmissionStatusGraded.GRADED,
        late_submission: {
          is_late: true,
          late_duration: "1 ngày 2 giờ"
        }
      },
      last_submission_time: "Saturday, 3 February 2024, 9:46 AM",
      last_grade_time: "Saturday, 3 February 2024, 9:46 AM",
      current_final_grade: 0,
      grades: [
        {
          question_id: "1",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 10
        },
        {
          question_id: "2",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 8
        },
        {
          question_id: "3",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 5
        }
      ]
    },
    {
      id: 2,
      student_name: "Nguyễn Quốc Tuấn",
      student_email: "tuannguyen@gmail.com",
      status: {
        submission_status_submitted: SubmissionStatusSubmitted.NOT_SUBMITTED,
        grade_status: SubmissionStatusGraded.NOT_GRADED,
        late_submission: {
          is_late: false,
          late_duration: "1 ngày 2 giờ"
        }
      },
      last_submission_time: "Saturday, 3 February 2024, 9:46 AM",
      last_grade_time: "Saturday, 3 February 2024, 9:46 AM",
      current_final_grade: 10,
      grades: [
        {
          question_id: "1",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 8
        },
        {
          question_id: "2",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 10
        },
        {
          question_id: "3",
          grade_status: SubmissionStatusGraded.GRADED,
          current_grade: 9
        }
      ]
    }
  ];

  const tableHeading: GridColDef[] = [
    {
      field: "student_name",
      headerName: `${t("common_fullname")} ${i18next.format(t("common_student"), "lowercase")}`,
      width: 200
    },
    { field: "student_email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: t("common_status"),
      width: 250,
      renderCell: (params) => {
        return (
          <Box padding='5px' width='100%'>
            <Box
              sx={{
                padding: "5px",
                backgroundColor:
                  params.value.submission_status_submitted === SubmissionStatusSubmitted.SUBMITTED
                    ? "var(--green-300)"
                    : "#f5f5f5",
                fontSize: "17px"
              }}
            >
              {params.value.submission_status_submitted === SubmissionStatusSubmitted.SUBMITTED
                ? "Đã nộp"
                : "Chưa nộp"}
            </Box>
            <Box
              sx={{
                padding: "5px",
                backgroundColor: "#EFCFCF",
                fontSize: "17px",
                display: params.value.late_submission.is_late ? "block" : "none"
              }}
            >
              {"Quá hạn "}
              {params.value.late_submission.late_duration}
            </Box>
            <Box
              sx={{
                padding: "5px",
                backgroundColor:
                  params.value.submission_status_submitted === SubmissionStatusSubmitted.SUBMITTED
                    ? "var(--green-300)"
                    : "#f5f5f5",
                fontSize: "17px",
                display:
                  params.value.grade_status === SubmissionStatusGraded.GRADED ? "block" : "none"
              }}
            >
              {params.value.grade_status === SubmissionStatusGraded.GRADED
                ? "Đã chấm"
                : "Chưa chấm"}
            </Box>
          </Box>
        );
      }
    },
    {
      field: "last_submission_time",
      headerName: t("course_lecturer_sub_last_submission_time"),
      width: 200
    },
    {
      field: "last_grade_time",
      headerName: t("course_lecturer_sub_last_grading_time"),
      width: 200
    },
    {
      field: "current_final_grade",
      headerName: t("common_final_grade"),
      width: 200,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              padding: "10px 0"
            }}
          >
            <Button
              btnType={BtnType.Primary}
              onClick={() => {
                navigate(routes.lecturer.exam.grading);
              }}
              margin='0 0 10px 0'
              translation-key='course_lecturer_assignment_grading'
            >
              {t("course_lecturer_assignment_grading")}
            </Button>
            <TextTitle>
              {params.value} / {examData.max_grade}
            </TextTitle>
          </Box>
        );
      }
    }
  ];

  const columnGroupingModel: GridColumnGroupingModel = [];

  examData.questions.forEach((question) => {
    tableHeading.push({
      field: `question-${question.id}`,
      headerName: question.question,
      width: 180,
      renderCell: () => {
        for (let i = 0; i < submissionList.length; i++) {
          for (let j = 0; j < submissionList[i].grades.length; j++) {
            if (submissionList[i].grades[j].question_id === question.id) {
              return (
                <TextTitle>
                  {submissionList[i].grades[j].current_grade} / {question.max_grade}
                </TextTitle>
              );
            }
          }
        }
      }
    });

    columnGroupingModel.push({
      groupId: `question-${question.id}-plagiarism-detection`,
      children: [
        {
          groupId: `question-${question.id}-type`,
          children: [{ field: `question-${question.id}` }],
          headerName: currentLang === "en" ? question.type.en_name : question.type.vi_name
        }
      ],
      renderHeaderGroup() {
        if (question.type.code === qtype.source_code.code) {
          return (
            <LoadButton
              loading={isPlagiarismDetectionLoading}
              btnType={BtnType.Outlined}
              onClick={() => onHandlePlagiarismDetection(question.id.toString())}
              translation-key='common_check_cheating'
            >
              {t("common_check_cheating")}
            </LoadButton>
          );
        } else if (question.type.code === "essay") {
          return (
            <Button
              btnType={BtnType.Outlined}
              onClick={() => {
                navigate(`${routes.lecturer.exam.ai_scroring}?questionId=${question.id}`);
              }}
              translation-key='common_AI_grading'
            >
              {t("common_AI_grading")}
            </Button>
          );
        } else {
          return null;
        }
      }
    });
  });

  useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  const submissionDataset = [
    {
      student: 59,
      range: "0.00 - 5.00"
    },
    {
      student: 50,
      range: "5.00 - 6.00"
    },
    {
      student: 47,
      range: "6.00 - 7.00"
    },
    {
      student: 54,
      range: "7.00 - 8.00"
    },
    {
      student: 57,
      range: "8.00 - 9.00"
    },
    {
      student: 60,
      range: "9.00 - 10.00"
    },
    {
      student: 59,
      range: "10.00 - 11.00"
    },
    {
      student: 65,
      range: "11.00 - 12.00"
    },
    {
      student: 51,
      range: "12.00 - 13.00"
    },
    {
      student: 60,
      range: "13.00 - 14.00"
    },
    {
      student: 67,
      range: "14.00 - 15.00"
    },
    {
      student: 61,
      range: "15.00 - 16.00"
    }
  ];

  const rowClickHandler = (params: GridRowParams<any>) => {
    console.log(params);
  };

  return (
    <Box className={classes.examBody}>
      <Button
        btnType={BtnType.Primary}
        onClick={() => {
          navigate(routes.lecturer.exam.detail);
        }}
        startIcon={
          <ChevronLeftIcon
            sx={{
              color: "white"
            }}
          />
        }
        width='fit-content'
      >
        <ParagraphBody translation-key='common_back'>{t("common_back")}</ParagraphBody>
      </Button>
      <Heading1>Bài kiểm tra cuối kỳ</Heading1>
      <ParagraphBody translation-key='course_lecturer_sub_num_of_student'>
        {t("course_lecturer_sub_num_of_student")}: {totalSubmissionCount}/{totalStudent}
      </ParagraphBody>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <SubmissionBarChart
          dataset={submissionDataset}
          xAxis={[{ scaleType: "band", dataKey: "range" }]}
          width={1000}
          height={500}
        />
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Heading1 translation-key='course_lecturer_submission_list'>
            {t("course_lecturer_submission_list")}
          </Heading1>
        </Grid>
        <Grid item xs={12}>
          <ExamSubmissionFeatureBar />
        </Grid>
        <Grid item xs={12}>
          <CustomDataGrid
            dataList={submissionList}
            tableHeader={tableHeading}
            onSelectData={rowSelectionHandler}
            visibleColumn={visibleColumnList}
            dataGridToolBar={dataGridToolbar}
            page={page}
            pageSize={pageSize}
            totalElement={totalElement}
            onPaginationModelChange={pageChangeHandler}
            showVerticalCellBorder={true}
            getRowHeight={() => "auto"}
            onClickRow={rowClickHandler}
            columnGroupingModel={columnGroupingModel}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LecturerCourseExamSubmissions;
