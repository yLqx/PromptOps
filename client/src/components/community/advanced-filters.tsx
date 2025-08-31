import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Heart, 
  MessageSquare, 
  Eye,
  Calendar,
  User,
  Tag,
  Mic,
  SlidersHorizontal
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  categories: any[];
  onApplyFilters: (filters: any) => void;
}

export default function AdvancedFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  onApplyFilters
}: AdvancedFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minRating, setMinRating] = useState([0]);
  const [minLikes, setMinLikes] = useState([0]);
  const [dateRange, setDateRange] = useState("all");
  const [authorPlan, setAuthorPlan] = useState("all");
  const [voiceOnly, setVoiceOnly] = useState(false);

  const popularTags = [
    "writing", "marketing", "coding", "creative", "business", "education",
    "productivity", "analysis", "research", "copywriting", "fiction",
    "programming", "debugging", "strategy", "planning", "tutorial"
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("trending");
    setSelectedTags([]);
    setMinRating([0]);
    setMinLikes([0]);
    setDateRange("all");
    setAuthorPlan("all");
    setVoiceOnly(false);
    onApplyFilters({});
  };

  const handleApplyAdvanced = () => {
    const filters = {
      tags: selectedTags,
      minRating: minRating[0],
      minLikes: minLikes[0],
      dateRange,
      authorPlan,
      voiceOnly
    };
    onApplyFilters(filters);
    setShowAdvanced(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedTags.length > 0) count++;
    if (minRating[0] > 0) count++;
    if (minLikes[0] > 0) count++;
    if (dateRange !== "all") count++;
    if (authorPlan !== "all") count++;
    if (voiceOnly) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Main Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts, tags, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name === "all" ? "All Categories" : category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  <span className="text-muted-foreground">({category.count})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trending">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Trending
              </div>
            </SelectItem>
            <SelectItem value="newest">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Newest
              </div>
            </SelectItem>
            <SelectItem value="popular">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Most Liked
              </div>
            </SelectItem>
            <SelectItem value="rating">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Highest Rated
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters */}
        <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Advanced Filters</h4>
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear All
                </Button>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-sm font-medium">Tags</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {popularTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => handleTagToggle(tag)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <Label className="text-sm font-medium">Minimum Rating</Label>
                <div className="mt-2">
                  <Slider
                    value={minRating}
                    onValueChange={setMinRating}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span className="font-medium">{minRating[0]} stars</span>
                    <span>5</span>
                  </div>
                </div>
              </div>

              {/* Likes Filter */}
              <div>
                <Label className="text-sm font-medium">Minimum Likes</Label>
                <div className="mt-2">
                  <Slider
                    value={minLikes}
                    onValueChange={setMinLikes}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span className="font-medium">{minLikes[0]} likes</span>
                    <span>100+</span>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <Label className="text-sm font-medium">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Author Plan */}
              <div>
                <Label className="text-sm font-medium">Author Plan</Label>
                <Select value={authorPlan} onValueChange={setAuthorPlan}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Voice Only */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Voice Created Only</Label>
                  <p className="text-xs text-muted-foreground">Show only prompts created with voice</p>
                </div>
                <input
                  type="checkbox"
                  checked={voiceOnly}
                  onChange={(e) => setVoiceOnly(e.target.checked)}
                  className="rounded"
                />
              </div>

              {/* Apply Button */}
              <Button onClick={handleApplyAdvanced} className="w-full">
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Quick Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 7).map((category) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.name)}
            className="text-xs"
          >
            <div 
              className="w-2 h-2 rounded-full mr-2" 
              style={{ backgroundColor: category.color }}
            />
            {category.name === "all" ? "All" : category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            <span className="ml-1 text-muted-foreground">({category.count})</span>
          </Button>
        ))}
      </div>

      {/* Active Filters Display */}
      {(selectedTags.length > 0 || minRating[0] > 0 || minLikes[0] > 0 || dateRange !== "all" || authorPlan !== "all" || voiceOnly) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => handleTagToggle(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {minRating[0] > 0 && (
            <Badge variant="secondary" className="text-xs">
              {minRating[0]}+ stars
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => setMinRating([0])}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {minLikes[0] > 0 && (
            <Badge variant="secondary" className="text-xs">
              {minLikes[0]}+ likes
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => setMinLikes([0])}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {dateRange !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {dateRange}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => setDateRange("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {authorPlan !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {authorPlan} plan
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => setAuthorPlan("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {voiceOnly && (
            <Badge variant="secondary" className="text-xs">
              <Mic className="h-3 w-3 mr-1" />
              Voice only
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => setVoiceOnly(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
